/* jslint node: true */
'use strict';

var requirejs = require('requirejs');

requirejs.config({
  nodeRequire: require
});

requirejs(['express'], function (express) {
  var app = express();

  var port = process.env.PORT || 9000;
  app.listen(port, function () {
    console.log('Express server listening on port ' + port);
  });

  app.use(express.static('public'));
});
