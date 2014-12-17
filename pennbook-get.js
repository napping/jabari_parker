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

  exports.getEntity = function (eid, callback) {
    var params = {
      KeyConditions: {
        eid: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [{ S: eid }]
        }
      },
      TableName: 'entities',
      Limit: 1
    };
    dynamodb.query(params, function (err, data) {
      if (err || !data.Items) {
        callback(null);
      } else {
        var result = {};
        for (var attr in data.Items[0]) {
          for (var type in data.Items[0][attr]) {
            result[attr] = data.Items[0][attr][type];
          }
        }
        callback(result);
      }
    });
  };
});
