// var user = require('../controllers/user');    

module.exports = function(app) {
    // app.get('/', page.index);
    app.get( "/", function (req, res) { 
        return res.use( "index" );
    });
};

