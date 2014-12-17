/* jslint node: true */
'use strict';

var requirejs = require('requirejs');

requirejs.config({
  nodeRequire: require
});

requirejs(['express', 'express-session', 'ejs', 'body-parser', 'pennbook-get',
    'pennbook-post'],
    function (express, session, ejs, bodyParser, pennbookGet, pennbookPost) {
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

  app.get('/', function (req, res) {
    if (req.session.eid) {
      res.render('index');
    } else {
      res.render('login');
    }
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
      pennbookGet.getProfile(eid, function (result) {
        result.valid = true;
        res.write(JSON.stringify(result));
        res.end();
      });
    } else {
      res.write(JSON.stringify({ valid: false, success: false }));
      res.end();
    }
  });

  var getEntity = function (req, res) {
    if (!req.session.eid || !req.params.eid) {
      res.write(JSON.stringify({ valid: false, success: false }));
      res.end();
    } else {
      pennbookGet.getEntity(req.params.eid, function (result) {
        result.valid = true;
        res.write(JSON.stringify(result));
        res.end();
      });
    }
  };

  app.get('/api/status/:eid', function (req, res) {
    getEntity(req, res);
  });

  app.post('/api/login', function (req, res) {
    if (!req.body.email || !req.body.password) {
      res.write(JSON.stringify({ valid: false, success: false }));
      res.end();
    } else {
      pennbookPost.login(req.body.email, req.body.password, function (result) {
        result.valid = true;
        if (result.success) {
          req.session.eid = result.eid;
        }
        res.write(JSON.stringify(result));
        res.end();
      });
    }
  });

  app.post('/api/logout', function (req, res) {
    if (req.session.eid) {
      res.write(JSON.stringify({ valid: true, success: true }));
    } else {
      res.write(JSON.stringify({ valid: false, success: false }));
    }
    res.end();
    req.session.destroy();
  });

  app.post('/api/status', function (req, res) {
    if (!req.session.eid || !req.body.statusText) {
      res.write(JSON.stringify({ valid: false, success: false }));
      res.end();
    } else {
      pennbookPost.saveStatus(req.session.eid, req.body.statusText,
          function (result) {
        result.valid = true;
        res.write(JSON.stringify(result));
        res.end();
      });
    }
  });
});
