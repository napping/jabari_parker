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
        "views/boxPeekView",
        "views/boxFriendsView",
        "views/boxSpecialsView",

	], function (	$, _, Backbone, vent, alertify,
                    User, UserStatus,
                    UserList,
                    SkeletonView, BoxUserView, BoxPeekView, BoxFriendsView, BoxSpecialsView
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
                
                var view = this;
                view.user.fetch({
                    success: function (model, response, options) { 
                        view.renderProfile(view.user);
                        view.renderPeek(view.user);     // TODO, test
                        view.renderFriends(view.user);
                        view.renderSpecial(view.user);

                    },
                    error: function (model, response, options) { 
                        vent.trigger( "error", "Failed fetching user " + eid + ": " + response );
                    },
                });
            },

            renderProfile: function (user) { 
                var router = this;
                var userStatus = new UserStatus({ statusEid: user.get("statusEid") });
                userStatus.fetch({
                    success: function (userStatus, response, options) {
                        user.set({ status: userStatus.get("statusText") }); 

                        router.boxUserView = new BoxUserView({ model: user });
                        $(".box-user").html( router.boxUserView.render().el );
                    },
                    error: function (userStatus, response, options) { 
                        console.log("Error getting user", user.get("firstName") + "'s status");

                        router.boxUserView = new BoxUserView({ model: user });
                        $(".box-user").html( router.boxUserView.render().el );
                    }
                });
            },

            renderPeek: function (user) {
                var router = this;
                user.fetch({
                    success: function (model, response, options) { 
                        var userStatus = new UserStatus({ statusEid: model.get("statusEid") });

                        userStatus.fetch({
                            success: function (userStatus, response, options) {
                                model.set({ status: userStatus.get("statusText") }); 

                                router.boxPeekView = new BoxPeekView({ model: model });
                                $(".box-peek").html( router.boxPeekView.render().el );
                            },

                            error: function (userStatus, response, options) { 
                                console.log("Error getting user", model.get("firstName") + "'s status");

                                router.boxPeekView = new BoxPeekView({ model: model });
                                $(".box-peek").html( router.boxPeekView.render().el );
                            },
                        });
                    },

                    error: function (model, response, options) { 
                        console.log();
                        vent.trigger( "error", "Failed fetching user " + eid + ": " + response );
                    },
                });
 
            },

            renderFriends: function (user) { 
                var friendEids = user.get("friendEids");

                this.friendsCollection = new UserList({ friendEids: friendEids });
                this.friendsCollection.fetch({
                    type: "POST",

                    data: JSON.stringify({ eids: friendEids }),

                    contentType: 'application/json',

                    dataType: "json", 

                    success: function (model, response, options) { 
                        console.log("Got friend " + model);
                        console.log(model);
                    },

                    error: function (model, response, options) { 
                        vent.trigger( "error", "Could not fetch friend user " 
                                     + model.get("eid") + ": " + response );
                    }
                });

            },

            renderSpecial: function (user) { 
                this.boxSpecialsView = new BoxSpecialsView();

                $(".box-specials").html( this.boxSpecialsView.render().el );
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

