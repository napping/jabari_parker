define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"alertify",
        "views/skeletonView",
        "views/boxUserView",
        "models/users",

	], function (	$, _, Backbone, vent, alertify,
                    SkeletonView, BoxUserView,
                    User
				) { 

		var Router = Backbone.Router.extend({
			routes: { 
				"": "loadIndex",
                "user/:eid": "loadUser",
                "back": "goBack",
			},

			initialize: function () {	// remove GET parameters on route?
                console.log("initializing");
				this.listenTo( vent, "message", function(message) {	    // TODO
					this.renderMessage( message ); 
				});	
				this.listenTo( vent, "error", function(message) {	    // TODO
					this.handleError( message ); 
				});	

                this.skeletonView = new SkeletonView({ loggedIn: true });

                $(".backbone-holder").html( this.skeletonView.render().el );
			},

			loadIndex: function () { 
                this.loadUser(123);
			},

            loadUser: function (eid) { 
                var user = new User({ eid: eid });
                
                var testUser = new User({ 
                    eid: eid,
                    email: "brishi@seas.upenn.edu",
                    firstName: "Brian",
                    lastName: "Shi",
                    interests: ["playing", "working", "sleeping"],
                    affiliation: "Philly",
                    birthday: "April 6th, 1783",
                });
                var router = this;

                router.boxUserView = new BoxUserView({ model: testUser });
                $(".box-user").html( router.boxUserView.render().el );
/*
                user.fetch({
                    success: function (model, response, options) { 
                        console.log("Success fetching user", eid, ".", response);

                        router.boxUserView = new BoxUserView({ model: model });
                        $(".box-user").html( router.boxUserView.render().el );
                    },
                    error: function (model, response, options) { 
                        console.log("Failed fetching user", eid, ".", response);
                    },
                });
*/
            },

            renderMessage: function () { 
                // TODO
            },

            handleError: function () { 
                // TODO
            },

			goBack: function () { 
				window.history.go(-2);
			},

		});

		return Router;
	}	
);

