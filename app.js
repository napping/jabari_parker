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
        if (result) {
          res.write(JSON.stringify(result));
        } else {
          res.status(500);
        }
        res.end();
      });
    } else {
      res.status(401);
      res.end();
    }
  });

  var getEntity = function (req, res) {
    if (!req.session.eid) {
      res.status(401);
      res.end();
    } else if (!req.params.eid) {
      res.status(204);
      res.end();
    } else {
      pennbookGet.getEntity(req.params.eid, function (result) {
        if (result) {
          res.write(JSON.stringify(result));
        } else {
          res.status(500);
        }
        res.end();
      });
    }
  };

  app.get('/api/status/:eid', function (req, res) {
    getEntity(req, res);
  });

  app.get('/api/wallPost/:eid', function (req, res) {
    getEntity(req, res);
  });

  app.post('/api/batchProfile', function (req, res) {
    if (!req.session.eid) {
      res.status(401);
      res.end();
    } else if (!req.body.eids) {
      res.status(204);
      res.end();
    } else {
      pennbookGet.batchGetProfile(req.body.eids, function (result) {
        if (result) {
          res.write(JSON.stringify(result));
        } else {
          res.status(500);
        }
        res.end();
      });
    }
  });

  app.post('/api/login', function (req, res) {
    if (!req.body.email || !req.body.password) {
      res.status(204);
      res.end();
    } else {
      pennbookPost.login(req.body.email, req.body.password, function (result) {
        if (result) {
          req.session.eid = result.eid;
          res.write(JSON.stringify(result));
        } else {
          res.status(500);
        }
        res.end();
      });
    }
  });

  app.post('/api/logout', function (req, res) {
    if (!req.session.eid) {
      res.status(500);
    }
    res.end();
    req.session.destroy();
  });

  app.post('/api/status', function (req, res) {
    if (!req.session.eid) {
      res.status(401);
      res.end();
    } else if (!req.body.statusText) {
      res.status(204);
      res.end();
    } else {
      pennbookPost.saveStatus(req.session.eid, req.body.statusText,
          function (result) {
        if (result) {
          res.write(JSON.stringify(result));
        } else {
          res.status(500);
        }
        res.end();
      });
    }
  });

  app.post('/api/wallPost', function (req, res) {
    if (!req.session.eid) {
      res.status(401);
      res.end();
    } else if (!req.body.ownerEid || !req.body.postText) {
      res.status(204);
      res.end();
    } else {
      pennbookPost.saveWallPost(req.session.eid, req.body.ownerEid,
          req.body.postText, function (result) {
        if (result) {
          res.write(JSON.stringify(result));
        } else {
          res.status(500);
        }
        res.end();
      });
    }
  });

  app.post('/api/friend/:eid', function (req, res) {
    if (!req.session.eid) {
      res.status(401);
      res.end();
    } else {
      pennbookPost.changeFriend('ADD', req.session.eid, req.params.eid,
          function (result) {
        if (result) {
          res.write(JSON.stringify(result));
        } else {
          res.status(500);
        }
        res.end();
      });
    }
  });

  app.post('/api/unfriend/:eid', function (req, res) {
    if (!req.session.eid) {
      res.status(401);
      res.end();
    } else {
      pennbookPost.changeFriend('DELETE', req.session.eid, req.params.eid,
          function (result) {
        if (result) {
          res.write(JSON.stringify(result));
        } else {
          res.status(500);
        }
        res.end();
      });
    }
  });
});
