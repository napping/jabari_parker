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
                this.user = new User();
                
                this.loadProfile(this.user);
                this.loadFriends(this.user);
                this.loadFriends(this.user);
            },

            loadProfile: function (user) { 
                var router = this;
                user.fetch({
                    success: function (model, response, options) { 
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
                        console.log();
                        vent.trigger( "error", "Failed fetching user" + eid + "." + response );
                    },
                });
            },

            loadFriends: function (user) { 
                var friends = user.get("friends");
                for (eid in friends) { 
                    var friend = new User({ eid: eid });

                }
            },

            loadPhotos: function (user) { 
                // TODO
            },

            renderMessage: function (message) { 
				message ? alertify.log( message, "success", 5000 ) : null;
            },

            handleError: function (message) { 
				message ? alertify.log( message, "error", 5000 ) : null;
J
            },

			goBack: function () { 
				window.history.go(-2);
			},

		});

		return Router;
	}	
);

