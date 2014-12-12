define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"alertify",

	], function (	$, _, Backbone, vent, alertify
				) { 

		var Router = Backbone.Router.extend({
			routes: { 
				"": "loadIndex",
                "back": "goBack",
			},

			initialize: function () {	// remove GET parameters on route?
				this.listenTo( vent, "message", function(message) {	 	// shows a success alertify.log on the bottom right  
					this.renderMessage( message ); 
				});	
			},

			loadIndex: function () { 
			},

            renderMessage: function () { 
            },

			goBack: function () { 
				window.history.go(-2);
			}
		});

		return Router;
	}	
);

