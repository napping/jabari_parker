/* jslint node: true */
/* global define */
'use strict';

define(['exports', 'aws-sdk', 'pennbook-util'],
    function (exports, AWS, pennbookUtil) {
  var dynamodb = new AWS.DynamoDB({ region: 'us-east-1' });

  exports.getProfile = function (eid, callback) {
    var params = {
      Key: {
        eid: { S: eid }
      },
      TableName: 'users',
    };
    dynamodb.getItem(params, function (err, data) {
      if (err) {
        console.log(err);
        callback(null);
      } else if (!data.Item) {
        callback({});
      } else {
        callback(pennbookUtil.flatten(data.Item));
      }
    });
  };

  exports.batchGetProfile = function (eids, callback) {
    var params = {
      RequestItems: {
        users: {
          Keys: []
        }
      }
    };
    for (var i = 0; i < eids.length; i++) {
      params.RequestItems.users.Keys.push({ eid: { S: eids[i] } });
    }
    dynamodb.batchGetItem(params, function (err, data) {
      if (err) {
        console.log(err);
        callback(null);
      } else {
        callback(data.Responses.users.map(pennbookUtil.flatten));
      }
    });
  };

  exports.getEntity = function (eid, callback) {
    var params = {
      Key: {
        eid: { S: eid }
      },
      TableName: 'entities'
    };
    dynamodb.getItem(params, function (err, data) {
      if (err) {
        console.log(err);
        callback(null);
      } else if (!data.Item) {
        callback({});
      } else {
        callback(pennbookUtil.flatten(data.Item));
      }
    });
  };

  exports.batchGetEntity = function (eids, callback) {
    var params = {
      RequestItems: {
        entities: {
          Keys: []
        }
      }
    };
    for (var i = 0; i < eids.length; i++) {
      params.RequestItems.entities.Keys.push({ eid: { S: eids[i] } });
    }
    dynamodb.batchGetItem(params, function (err, data) {
      if (err) {
        console.log(err);
        callback(null);
      } else {
        callback(data.Responses.entities.map(pennbookUtil.flatten));
      }
    });
  };

  var makeTimestampQuery = function (filter, attributeNames, attributeValues) {
    return function (ownerEids, timestamp, callback) {
      var result = [];
      var doQuery;
      doQuery = function (lastEvaluated) {
        var params = {
          KeyConditions: {
            ownerEid: {
              ComparisonOperator: 'EQ',
              AttributeValueList: []
            },
            timestamp: {
              ComparisonOperator: 'LT',
              AttributeValueList: [{ N: timestamp.toString() }],
            }
          },
          TableName: 'entities',
          IndexName: 'ownerEid-timestamp-index',
          Limit: 15,
          ScanIndexForward: false
        };
        for (var i = 0; i < ownerEids.length; i++) {
          params.KeyConditions.ownerEid.AttributeValueList.push({ S: ownerEids[i] });
        }
        if (filter) {
          params.FilterExpression = filter;
          params.ExpressionAttributeNames = attributeNames;
          params.ExpressionAttributeValues = attributeValues;
        }
        if (lastEvaluated) {
          params.ExclusiveStartKey = lastEvaluated;
        }
        dynamodb.query(params, function (err, data) {
          if (err) {
            console.log(err);
            callback(null);
          } else {
            result = result.concat(data.Items);
            if (data.LastEvaluatedKey) {
              doQuery(data.LastEvaluatedKey);
            } else {
              callback(result.map(pennbookUtil.flatten));
            }
          }
        });
      };
      doQuery(null);
    };
  };
  exports.getWall = function (ownerEid, timestamp, callback) {
    makeTimestampQuery('#t = :type', { '#t': 'type' }, { ':type': { S: 'wallPost' } })
      ([ownerEid], timestamp, callback);
  };
  exports.getNewsfeed = function (userEid, timestamp, callback) {
    exports.getProfile(userEid, function (result) {
      var newsfeedEids;
      if (result && result.friendEids) {
        newsfeedEids = result.friendEids.concat([userEid]);
      } else if (result) {
        newsfeedEids = [userEid];
      } else {
        callback(null);
        return;
      }
      makeTimestampQuery()(newsfeedEids, timestamp, callback);
    });
  };

  exports.userSearch = function (query, callback) {
    var result = [];
    var doQuery;
    doQuery = function (lastEvaluated) {
      var params = {
        TableName: 'users',
        FilterExpression: '#fn BEGINS_WITH :query OR #ln BEGINS_WITH :query',
        ExpressionAttributeNames: {
          '#fn': 'firstName',
          '#ln': 'lastName'
        },
        ExpressionAttributeValues: { ':query': { S: query } }
      };
      if (lastEvaluated) {
        params.ExclusiveStartKey = lastEvaluated;
      }
      dynamodb.scan(params, function (err, data) {
        if (err) {
          console.log(err);
          callback(null);
        } else {
          result = result.concat(data.Items);
          if (data.LastEvaluatedKey) {
            doQuery(data.LastEvaluatedKey);
          } else {
            callback(result.map(pennbookUtil.flatten));
          }
        }
      });
    };
    doQuery(null);
  };
});
