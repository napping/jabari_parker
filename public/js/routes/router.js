define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"alertify",
        "views/skeletonView",
        "views/boxUserView",
        "models/users",
        "models/userStatuses",

	], function (	$, _, Backbone, vent, alertify,
                    SkeletonView, BoxUserView,
                    User, UserStatus
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
                this.loadUser(123);     // TODO TESTING
			},

            loadUser: function (eid) { 
                var testUser = new User({   // TODO TESTING
                    eid: eid,
                    email: "brishi@seas.upenn.edu",
                    firstName: "Brian",
                    lastName: "Shi",
                    interests: ["playing", "working", "sleeping"],
                    affiliation: "Philly",
                    birthday: "April 6th, 1783",
                });
                // router.boxUserView = new BoxUserView({ model: testUser });
                // $(".box-user").html( router.boxUserView.render().el );

                var user = new User();
                var router = this;
                
                user.fetch({
                    success: function (model, response, options) { 
                        console.log("Success fetching user", eid, ".", response);
                        console.log(model);
                        console.log(model.get("statusEid"));

                        var userStatus = new UserStatus({ statusEid: model.get("statusEid") });
                        userStatus.fetch({
                            success: function (userStatus, response, options) {
                                model.set({ status: userStatus.get("statusText") }); 

                                router.boxUserView = new BoxUserView({ model: model });
                                $(".box-user").html( router.boxUserView.render().el );

                            },
                            error: function (userStatus, response, options) { 
                                console.log("Error getting user", model.get("firstName") + "'s status");

                                router.boxUserView = new BoxUserView({ model: model });
                                $(".box-user").html( router.boxUserView.render().el );

                            }
                        });
                    },
                    error: function (model, response, options) { 
                        console.log("Failed fetching user", eid, ".", response);
                    },
                });
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

