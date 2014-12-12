/* jslint node: true */
'use strict';

var requirejs = require('requirejs');

requirejs.config({
  nodeRequire: require
});

requirejs(['express', 'express-session', 'body-parser', 'aws-sdk', 'crypto'],
    function (express, session, bodyParser, AWS, crypto) {
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

  app.use(bodyParser.json());

  app.use(express.static('public'));

  var dynamodb = new AWS.DynamoDB();

  app.post('/api/login', function (req, res) {
    if (!req.body.email || !req.body.password) {
      res.write(JSON.stringify({ success: false }));
      res.end();
      return;
    }
    var params = {
      Key: {
        email: {
          S: req.body.email
        }
      },
      TableName: 'users',
      ProjectionExpression: 'uuid, password'
    };
    dynamodb.getItem(params, function (err, data) {
      if (err) {
        res.write(JSON.stringify({ success: false }));
      } else {
        var password = data.Item.password.S;
        var sha256sum = crypto.createHash('sha256');
        sha256sum.update(req.body.password);
        if (sha256sum.digest() === password) {
          // user authentication successful
          req.session.uuid = data.Item.uuid.S;
          res.write(JSON.stringify({ success: true }));
        } else {
          // user authentication failed
          res.write(JSON.stringify({ success: false }));
        }
      }
    });
    res.end();
  });

  app.post('/api/logout', function (req, res) {
    req.session.destroy();
    res.end();
  });

  app.get('/api/profile/:uuid', function (req, res) {
    if (req.session.uuid && req.params.uuid) {
      var params = {
        Key: {
          uuid: {
            S: req.params.uuid
          }
        },
        TableName: 'users',
        ProjectionExpression: 'firstName, lastName, interests, affiliation, birthday'
      };
      dynamodb.getItem(params, function (err, data) {
        if (err) {
          req.write(JSON.stringify({ success: false }));
        } else {
          req.write(JSON.stringify({
            success: true,
            firstName: data.Item.firstName.S,
            lastName: data.Item.lastName.S,
            interests: data.Item.interests.SS,
            affiliation: data.Item.affiliation.S,
            birthday: data.Item.birthday.N
          }));
        }
      });
    } else {
      res.write(JSON.stringify({
        success: false
      }));
    }
    res.end();
  });
});
