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
        eid: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [{ S: eid }]
        }
      },
      TableName: 'entities'
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

  exports.getNewsfeed = function (ownerEid, timestamp, callback) {
    var result = [];
    var doRequest;
    doRequest = function (lastEvaluated) {
      var params = {
        KeyConditions: {
          ownerEid: {
            ComparisonOperator: 'EQ',
            AttributeValueList: [{ S: ownerEid }]
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
            doRequest(data.LastEvaluatedKey);
          } else {
            callback(result);
          }
        }
      });
    };
    doRequest(null);
  };
});
