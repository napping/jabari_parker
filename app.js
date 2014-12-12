/* jslint node: true */
'use strict';

var requirejs = require('requirejs');

requirejs.config({
  nodeRequire: require
});

requirejs(['express', 'express-session', 'ejs', 'body-parser', 'aws-sdk', 'crypto', 'node-uuid'],
    function (express, session, ejs, bodyParser, AWS, crypto, uuid) {
  var app = express();

  var port = process.env.PORT || 9000;
  app.listen(port, function () {
    console.log('Express server listening on port ' + port);
  });

  app.use(session({
    secret: 'new-age',
    resave: false,
    saveUninitialized: false
  }));

  app.engine('html', ejs.renderFile);
  app.set('view engine', 'ejs');

  app.use(bodyParser.json());

  app.use('/static', express.static('public'));

  AWS.config.region = 'us-east-1';
  var dynamodb = new AWS.DynamoDB();

  app.get('/', function (req, res) {
    if (req.session.eid) {
      res.render('index');
    } else {
      res.render('login');
    }
    res.end();
  });

  app.post('/api/login', function (req, res) {
    if (!req.body.email || !req.body.password) {
      res.write(JSON.stringify({ success: false }));
      res.end();
      return;
    }
    var params = {
      KeyConditions: {
        email: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [{ S: req.body.email }]
        }
      },
      TableName: 'users',
      IndexName: 'email-index',
      Limit: 1,
      ProjectionExpression: 'eid, password'
    };
    dynamodb.query(params, function (err, data) {
      if (err || !data.Items) {
        res.write(JSON.stringify({ success: false }));
      } else {
        var password = data.Items[0].password.S;
        var sha256sum = crypto.createHash('sha256');
        sha256sum.update(req.body.password);
        if (sha256sum.digest('hex') === password) {
          // user authentication successful
          req.session.eid = data.Items[0].eid.S;
          res.write(JSON.stringify({ success: true }));
        } else {
          // user authentication failed
          res.write(JSON.stringify({ success: false }));
        }
      }
      res.end();
    });
  });

  app.post('/api/logout', function (req, res) {
    req.session.destroy();
    res.end();
  });

  app.get('/api/profile/:eid?', function (req, res) {
    var eid;
    if (req.params.eid) {
      eid = req.params.eid;
    } else {
      eid = req.session.eid;
    }
    if (req.session.eid) {
      var params = {
        Key: {
          eid: {
            S: eid
          }
        },
        TableName: 'users',
        ProjectionExpression: 'statusEid, firstName, lastName, interests, affiliation, birthday'
      };
      dynamodb.getItem(params, function (err, data) {
        if (err || !data.Item) {
          res.write(JSON.stringify({ success: false }));
        } else {
          res.write(JSON.stringify({
            success: true,
            statusEid: data.Item.statusEid.S,
            firstName: data.Item.firstName.S,
            lastName: data.Item.lastName.S,
            interests: data.Item.interests.SS,
            affiliation: data.Item.affiliation.S,
            birthday: data.Item.birthday.N
          }));
        }
        res.end();
      });
    } else {
      res.write(JSON.stringify({
        success: false
      }));
      res.end();
    }
  });

  app.get('/api/entity/:eid', function (req, res) {
    if (!req.session.eid || !req.params.eid) {
      res.write(JSON.stringify({ success: false }));
      res.end();
      return;
    }
    var params = {
      Key: {
        eid: {
          S: req.params.eid
        }
      },
      TableName: 'entities'
    };
    dynamodb.getItem(params, function (err, data) {
      if (err || !data.Item) {
        res.write(JSON.stringify({ success: false }));
      } else {
        var result = { success: true };
        for (var attr in data.Item) {
          for (var type in data.Item[attr]) {
            result[attr] = data.Item[attr][type];
          }
        }
        res.write(JSON.stringify(result));
      }
      res.end();
    });
  });

  app.post('/api/entity', function (req, res) {
    if (!req.session.eid || !req.body.statusText) {
      res.write(JSON.stringify({ success: false }));
      res.end();
      return;
    }
    var params = {
      Item: {
        eid: { S: uuid.v4() },
        ownerEid: { S: req.session.eid },
        timestamp: { N: Math.floor(new Date() / 1000).toString() }
      },
      TableName: 'entities'
    };
    for (var attr in req.body) {
      params.Item[attr] = { S: req.body[attr] };
    }
    dynamodb.putItem(params, function (err, data) {
      if (err) {
        res.write(JSON.stringify({ success: false }));
        res.end();
      } else {
        // update the current status attribute in the user table
        var params2 = {
          Key: {
            eid: { S: req.session.eid }
          },
          TableName: 'users',
          UpdateExpression: 'SET statusEid = :newEid',
          ExpressionAttributeValues: {
            ':newEid': { S: params.Item.eid.S }
          }
        };
        dynamodb.updateItem(params2, function (err, data) {
          if (err) {
            res.write(JSON.stringify({ success: false }));
          } else {
            // write the new status back to the client
            var result = {
              success: true,
              eid: params.Item.eid.S,
              ownerEid: params.Item.ownerEid.S,
              timestamp: params.Item.timestamp.N
            };
            for (var attr in req.body) {
              result[attr] = req.body[attr];
            }
            res.write(JSON.stringify(result));
          }
          res.end();
        });
      }
    });
  });
});
