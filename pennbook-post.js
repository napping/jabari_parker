/* jslint node: true */
/* global define */
'use strict';

define(['exports', 'aws-sdk', 'crypto', 'node-uuid', 'pennbook-util'],
    function (exports, AWS, crypto, uuid, pennbookUtil) {
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
      if (err) {
        console.log(err);
        callback(null);
      } else if (!data.Items) {
        callback(null);
      } else {
        var storedPassword = data.Items[0].password.S;
        var sha256sum = crypto.createHash('sha256');
        sha256sum.update(password);
        if (sha256sum.digest('hex') === storedPassword) {
          // user authentication successful
          callback({ eid: data.Items[0].eid.S });
        } else {
          // user authentication failed
          callback(null);
        }
      }
    });
  };

  exports.createAccount = function (email, password, firstName, lastName,
      callback) {
    var sha256sum = crypto.createHash('sha256');
    sha256sum.update(password);
    var params = {
      Item: {
        eid: { S: uuid.v4() },
        email: { S: email },
        password: { S: sha256sum.digest('hex') },
        firstName: { S: firstName },
        lastName: { S: lastName }
      },
      TableName: 'users'
    };
    dynamodb.putItem(params, function (err, data) {
      if (err) {
        console.log(err);
        callback(null);
      } else {
        callback({});
      }
    });
  };

  exports.saveProfile = function (eid, firstName, lastName, affiliation,
      interests, callback) {
    var updateParams = {
      Key: {
        eid: { S: eid }
      },
      TableName: 'users',
      UpdateExpression: 'SET #fn = :firstName SET #ln = :lastName ' + 
        'SET #a = :affiliation SET #i = :interests',
      ExpressionAttributeNames: {
        '#fn': 'firstName',
        '#ln': 'lastName',
        '#a': 'affiliation',
        '#i': 'interests'
      },
      ExpressionAttributeValues: {
        ':firstName': { S: firstName },
        ':lastName': { S: lastName },
        ':affiliation': { S: affiliation },
        ':interests': { SS: interests }
      },
      ReturnValues: 'ALL_UPDATED'
    };
    dynamodb.updateItem(updateParams, function (err, data) {
      if (err) {
        console.log(err);
        callback(null);
      } else {
        var putParams = {
          Item: {
            eid: { S: uuid.v4() },
            ownerEid: { S: eid },
            timestamp: { N: Math.floor(new Date() / 1000).toString() },
            type: { S: 'profileUpdate' },
            updates: { M: data.Attributes }
          },
          TableName: 'entities'
        };
        dynamodb.putItem(putParams, function (err, data) {
          if (err) {
            console.log(err);
            callback(null);
          } else {
            callback({});
          }
        });
      }
    });
  };

  exports.saveStatus = function (ownerEid, statusText, callback) {
    var putParams = {
      Item: {
        eid: { S: uuid.v4() },
        ownerEid: { S: ownerEid },
        timestamp: { N: Math.floor(new Date() / 1000).toString() },
        type: { S: 'status' },
        statusText: { S: statusText }
      },
      TableName: 'entities'
    };
    dynamodb.putItem(putParams, function (err, data) {
      if (err) {
        console.log(err);
        callback(null);
      } else {
        // update the current status and child entity set in the users table
        var addedItem = data.Item;
        var updateParams = {
          Key: {
            eid: { S: ownerEid }
          },
          TableName: 'users',
          UpdateExpression: 'SET #s = :eid',
          ExpressionAttributeNames: { '#s': 'statusEid' },
          ExpressionAttributeValues: { ':eid': { S: putParams.Item.eid.S } }
        };
        dynamodb.updateItem(updateParams, function (err, data) {
          if (err) {
            console.log(err);
            callback(null);
          } else {
            callback(pennbookUtil.flatten(addedItem));
          }
        });
      }
    });
  };

  exports.saveWallPost = function (posterEid, ownerEid, postText, callback) {
    var putParams = {
      Item: {
        eid: { S: uuid.v4() },
        ownerEid: { S: ownerEid },
        timestamp: { N: Math.floor(new Date() / 1000).toString() },
        type: { S: 'wallPost' },
        posterEid: { S: posterEid },
        postText: { S: postText }
      },
      TableName: 'entities'
    };
    dynamodb.putItem(putParams, function (err, data) {
      if (err) {
        console.log(err);
        callback(null);
      } else {
        callback(pennbookUtil.flatten(data.Item));
      }
    });
  };

  var changeFriend = function (operation, eid1, eid2, callback) {
    var params1 = {
      Key: {
        eid: { S: eid1 }
      },
      TableName: 'users',
      UpdateExpression: operation + ' #f :eid2',
      ExpressionAttributeNames: { '#f': 'friendEids' },
      ExpressionAttributeValues: { ':eid2': { SS: [eid2] } }
    };
    dynamodb.updateItem(params1, function (err, data) {
      if (err) {
        console.log(err);
        callback(null);
      } else {
        var params2 = {
          Key: {
            eid: { S: eid2 }
          },
          TableName: 'users',
          UpdateExpression: operation + ' #f :eid1',
          ExpressionAttributeNames: { '#f': 'friendEids' },
          ExpressionAttributeValues: { ':eid1': { SS: [eid1] } }
        };
        dynamodb.updateItem(params2, function (err, data) {
          if (err) {
            console.log(err);
            callback(null);
          } else {
            callback({});
          }
        });
      }
    });
  };
  exports.addFriend = function (eid1, eid2, callback) {
    changeFriend('ADD', eid1, eid2, function (result) {
      if (result) {
        var params = {
          Item: {
            eid: { S: uuid.v4() },
            ownerEid: { S: eid2 },
            timestamp: { N: Math.floor(new Date() / 1000).toString() },
            type: 'friendship',
            posterEid: { S: eid1 }
          },
          TableName: 'entities'
        };
        dynamodb.putItem(params, function (err, callback) {
          if (err) {
            console.log(err);
            callback(null);
          } else {
            callback({});
          }
        });
      } else {
        callback(null);
      }
    });
  };
  exports.removeFriend = function (eid1, eid2, callback) {
    changeFriend('DELETE', eid1, eid2, callback);
  };
});
