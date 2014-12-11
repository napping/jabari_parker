var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    config = require('./config/config');
    path = require('path');

module.exports = function(app) {
    app.set('port', process.env.PORT || 9000);

    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.use(cookieParser(config.cookieSecret));
    app.use(session({
        secret: config.cookieSecret,
        cookie: {maxAge: 1000 * 60 * 60},
        saveUninitialized: true,
        resave: true
    }));

    app.locals.site = config.site;

    app.use(function(req, res, next) {

        if (req.session.username) {
            //res.locals.layout = 'layouts/user';
            res.locals.authUser = req.session.username;
        } else {
            //res.locals.layout = 'layouts/guest';
            res.locals.authUser = false;
        }

        next();
    });

    require('./routes')(app);

    app.use('/static', express.static(config.root + '/public'));

};

