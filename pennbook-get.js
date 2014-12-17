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
        callback({ success: false });
      } else {
        var result = { success: true };
        for (var attr in data.Item) {
          for (var type in data.Item[attr]) {
            result[attr] = data.Item[attr][type];
          }
        }
        callback(result);
      }
    });
  };

  exports.getEntity = function (eid, callback) {
    var params = {
      Item: {
        eid: { S: eid }
      },
      TableName: 'entities'
    };
    dynamodb.getItem(params, function (err, data) {
      if (err || !data.Item) {
        callback({ success: false });
      } else {
        var result = { success: true };
        for (var attr in data.Item) {
          for (var type in data.Item[attr]) {
            result[attr] = data.Item[attr][type];
          }
        }
        callback(result);
      }
    });
  };
});
