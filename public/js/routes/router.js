define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"alertify",
        "models/users",
        "models/userStatuses",
        "collections/userLists",
        "collections/wallpostLists",
        "views/skeletonView",
        "views/boxUserView",
        "views/boxPeekView",
        "views/boxFriendsView",
        "views/boxSpecialsView",
        "views/boxWallView",

	], function (	$, _, Backbone, vent, alertify,
                    User, UserStatus,
                    UserList, WallPostList,
                    SkeletonView, BoxUserView, BoxPeekView, BoxFriendsView, BoxSpecialsView, BoxWallView
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

				this.listenTo( vent, "showFriend", function(friend) {	    // TODO
					this.renderFriendPeek( friend ); 
				});	

				this.listenTo( vent, "showWall", function() {	    // TODO
					this.renderWall(); 
				});	

                this.skeletonView = new SkeletonView({ loggedIn: true });

                $(".backbone-holder").html( this.skeletonView.render().el );
			},

			loadIndex: function () { 
                this.loadUser();     // TODO TESTING
			},

            loadUser: function () { 
                this.user = new User();
                
                var router = this;
                router.user.fetch({
                    success: function (model, response, options) { 
                        router.renderProfile(router.user);
                        router.renderPeek(router.user);     // TODO, test
                        router.renderFriends(router.user);
                        router.renderSpecial(router.user);

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
                        router.renderFade( ".box-user", router.boxUserView );
                    },
                    error: function (userStatus, response, options) { 
                        console.log("Error getting user", user.get("firstName") + "'s status");

                        router.boxUserView = new BoxUserView({ model: user });
                        router.renderFade( ".box-user", router.boxUserView );
                    }
                });
            },

            renderPeek: function (user) {
                var router = this;
                $(".box-peek").hide().html("<h3 class='creep-suggestion'>Creep on somebody!</h3>").fadeIn();
/*                
                user.fetch({
                    success: function (model, response, options) { 
                        var userStatus = new UserStatus({ statusEid: model.get("statusEid") });

                        userStatus.fetch({
                            success: function (userStatus, response, options) {
                                model.set({ status: userStatus.get("statusText") }); 

                                router.boxPeekView = new BoxPeekView({ model: model });
                                router.renderFade( ".box-peek", router.boxPeekView );
                            },

                            error: function (userStatus, response, options) { 
                                console.log("Error getting user", model.get("firstName") + "'s status");

                                router.boxPeekView = new BoxPeekView({ model: model });
                                router.renderFade( ".box-peek", router.boxPeekView );
                            },
                        });
                    },

                    error: function (model, response, options) { 
                        console.log();
                        vent.trigger( "error", "Failed fetching user " + eid + ": " + response );
                    },
                });
 */
            },

            renderFriends: function (user) { 
                var friendEids = user.get("friendEids") ? user.get("friendEids") : [];

                this.friendsCollection = new UserList({ friendEids: friendEids });
                var router = this;
                this.friendsCollection.fetch({
                    type: "POST",

                    data: JSON.stringify({ eids: friendEids }),

                    contentType: 'application/json',

                    dataType: "json", 

                    success: function (collection, response, options) { 
                        router.boxFriendsView = new BoxFriendsView({ collection: collection }); 

                        router.renderFade( ".box-friends", router.boxFriendsView );
                    },

                    error: function (model, response, options) { 
                        vent.trigger( "error", "Could not fetch friend user " 
                                     + model.get("eid") + ": " + response );
                    }
                });

            },

            renderSpecial: function (user) { 
                this.boxSpecialsView = new BoxSpecialsView();

                this.renderFade( ".box-specials", this.boxSpecialsView );
            },

            renderWall: function () { 
                var router = this;
                var wallPostCollection = new WallPostList({ eid: router.user.get("eid") });

                this.wallPostCollection.fetch({
                    success: function (collection, response, options) { 
                        router.boxUser2View = new BoxWallView({ collection: collection }); 

                        router.renderFade( ".box-peek2", router.boxUser2View );
                    },

                    error: function (model, response, options) { 
                        vent.trigger( "error", "Could not fetch wall posts for user" + router.user.get("email") + " response: " + response );
                    }
                });


                router.boxWallView = new BoxWallView({ collection: null });

                router.renderWall
            },

            renderPhotos: function (user) { 
                // TODO
            },

            renderFriendPeek: function (friend) { 
                var router = this;
                var userStatus = new UserStatus({ statusEid: friend.get("statusEid") });
                router.boxPeekView = new BoxPeekView({ model: friend });

                userStatus.fetch({
                    success: function (userStatus, response, options) {
                        friend.set({ status: userStatus.get("statusText") }); 

                        router.renderFade( ".box-peek", router.boxPeekView );
                    },

                    error: function (userStatus, response, options) { 
                        console.log("Error getting user", friend.get("firstName") + "'s status");

                        router.renderFade( ".box-peek", router.boxPeekView );
                    }
                });
            },

            renderMessage: function (message) { 
				message ? alertify.log( message, "success", 5000 ) : null;
            },

            handleError: function (message) { 
				message ? alertify.log( message, "error", 5000 ) : null;
            },

            renderFade: function( selector, view ) { 
                $(selector).hide().html( view.render().el ).fadeIn(1100);
            },

			goBack: function () { 
				window.history.go(-2);
			},

		});

		return Router;
	}	
);

