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
        req.write(JSON.stringify({ success: false }));
      } else {
        var password = data.Item.password.S;
        var sha256sum = crypto.createHash('sha256');
        sha256sum.update(req.body.password);
        if (sha256sum.digest() === req.body.password) {
          // user authentication successful
          req.session.uuid = data.Item.uuid.S;
          req.write(JSON.stringify({ success: true }));
        } else {
          // user authentication failed
          req.write(JSON.stringify({ success: false }));
        }
      }
    });
  });
});
