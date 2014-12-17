/* jslint node: true */
/* global define */
'use strict';

define(['exports', 'aws-sdk'], function (exports, AWS) {
  var dynamodb = new AWS.DynamoDB({ region: 'us-east-1' });

  exports.getProfile = function (eid, callback) {
    var params = {
      Key: {
        eid: { S: eid }
      },
      TableName: 'users',
    };
    dynamodb.getItem(params, function (err, data) {
      if (err || !data.Item) {
        callback(null);
      } else {
        var result = {};
        for (var attr in data.Item) {
          for (var type in data.Item[attr]) {
            result[attr] = data.Item[attr][type];
          }
        }
        callback(result);
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
        callback(null);
      } else {
        var result = [];
        for (var i = 0; i < data.Responses.users.length; i++) {
          var row = {};
          for (var attr in data.Responses.users[i]) {
            for (var type in data.Responses.users[i][attr]) {
              row[attr] = data.Responses.users[i][attr][type];
            }
          }
          result.push(row);
        }
        callback(result);
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
      if (err || !data.Item) {
        console.log(err);
        callback(null);
      } else {
        var result = {};
        for (var attr in data.Item) {
          for (var type in data.Item[attr]) {
            result[attr] = data.Item[attr][type];
          }
        }
        callback(result);
      }
    });
  };

  var makeTimestampQuery = function (filter) {
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
              comparisonOperator: 'LT',
              AttributeValueList: [{ N: timestamp }],
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
        }
        if (lastEvaluated) {
          params.ExclusiveStartKey = lastEvaluated;
        }
        dynamodb.query(params, function (err, data) {
          if (err) {
            callback(null);
          } else {
            for (var i = 0; i < data.Items.length; i++) {
              var item = {};
              for (var attr in data.Items[i]) {
                for (var type in data.Items[i][attr]) {
                  item[attr] = data.Items[i][attr][type];
                }
              }
              result.push(item);
            }
            if (data.LastEvaluatedKey.ownerEid) {
              doQuery(data.LastEvaluatedKey);
            } else {
              callback(result);
            }
          }
        });
      };
      doQuery(null);
    };
  };
  exports.getWall = function (ownerEid, timestamp, callback) {
    makeTimestampQuery('type = "wallPost"')([ownerEid], timestamp, callback);
  };
  exports.getNewsfeed = function (userEid, timestamp, callback) {
    exports.getProfile(userEid, function (result) {
      if (result) {
        makeTimestampQuery(null)([result.friendEids], timestamp, callback);
      } else {
        callback(null);
      }
    });
  };
});
