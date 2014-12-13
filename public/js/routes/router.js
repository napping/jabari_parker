define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"alertify",
        "models/users",
        "models/userStatuses",
        "collections/userLists",
        "views/skeletonView",
        "views/boxUserView",
        "views/boxFriendsView",

	], function (	$, _, Backbone, vent, alertify,
                    User, UserStatus,
                    UserList,
                    SkeletonView, BoxUserView, BoxFriendsView
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
                this.loadUser();     // TODO TESTING
			},

            loadUser: function () { 
                this.user = new User();
                
                this.renderProfile(this.user);
                this.renderFriends(this.user);
                this.renderPhotos(this.user);
            },

            renderProfile: function (user) { 
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
                        vent.trigger( "error", "Failed fetching user " + eid + ": " + response );
                    },
                });
            },

            renderFriends: function (user) { 
                var friends = user.get("friends");

                this.friendsCollection = new UserList();

                var router = this;
                for (eid in friends) { 
                    var friend = new User({ eid: eid });
                    this.friendsCollection.add( friend );
                }

                this.boxFriendsView = new BoxFriendsView({ collection: this.friendsCollection });

                $(".box-friends", this.el).html( this.boxFriendsView.render().el );
                /*
                this.friendsCollection.fetch({
                    success: function (model, response, options) { 
                        console.log("Got friend " + model);
                    },

                    error: function (model, response, options) { 
                        vent.trigger( "error", "Could not fetch friend user " 
                                     + model.get("eid") + ": " + response );
                    }
                });
                */
            },

            renderPhotos: function (user) { 
                // TODO
            },

            renderMessage: function (message) { 
				message ? alertify.log( message, "success", 5000 ) : null;
            },

            handleError: function (message) { 
				message ? alertify.log( message, "error", 5000 ) : null;
            },

			goBack: function () { 
				window.history.go(-2);
			},

		});

		return Router;
	}	
);

