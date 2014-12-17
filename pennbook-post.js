/* jslint node: true */
/* global define */
'use strict';

define(['exports', 'aws-sdk', 'crypto', 'node-uuid'],
    function (exports, AWS, crypto, uuid) {
  var dynamodb = new AWS.DynamoDB({ region: 'us-east-1' });

  exports.login = function (email, password, callback) {
    var params = {
      KeyConditions: {
        email: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [{ S: email }]
        }
      },
      TableName: 'users',
      IndexName: 'email-index',
      Limit: 1,
      ProjectionExpression: 'eid, password'
    };
    dynamodb.query(params, function (err, data) {
      if (err || !data.Items) {
        callback({ success: false });
      } else {
        var storedPassword = data.Items[0].password.S;
        var sha256sum = crypto.createHash('sha256');
        sha256sum.update(password);
        if (sha256sum.digest('hex') === storedPassword) {
          // user authentication successful
          callback({ success: true, eid: data.Items[0].eid.S });
        } else {
          // user authentication failed
          callback({ success: false });
        }
      }
    });
  };

  exports.saveStatus = function (ownerEid, statusText, callback) {
    var putParams = {
      Item: {
        eid: { S: uuid.v4() },
        timestamp: { N: Math.floor(new Date() / 1000).toString() },
        type: { S: 'status' },
        statusText: { S: statusText }
      },
      TableName: 'entities'
    };
    dynamodb.putItem(putParams, function (err, data) {
      if (err) {
        callback({ success: false });
      } else {
        // update the current status and child entity set in the users table
        var updateParams = {
          Key: {
            eid: { S: ownerEid }
          },
          TableName: 'users',
          UpdateExpression: 'SET #s = :eid ADD #o :eidSet',
          ExpressionAttributeNames: {
            '#s': 'statusEid',
            '#o': 'ownedEids'
          },
          ExpressionAttributeValues: {
            ':eid': { S: putParams.Item.eid.S },
            ':eidSet': { SS: [putParams.Item.eid.S] }
          }
        };
        dynamodb.updateItem(updateParams, function (err, data) {
          if (err) {
            callback({ success: false });
          } else {
            var result = { success: true };
            for (var attr in putParams.Item) {
              for (var type in putParams.Item[attr]) {
                result[attr] = putParams.Item[attr][type];
              }
            }
            callback(result);
          }
        });
      }
    });
  };
});
