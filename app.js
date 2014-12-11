var express = require( "express" );
var app = express();

require( "./init" )( app );

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

app.use(express.static("public"));

