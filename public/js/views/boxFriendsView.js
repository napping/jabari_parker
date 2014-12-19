define([
		"jquery",
		"underscore",
		"backbone",
		"events",
        "collections/userLists",
		"text!../../templates/box-friends.html",

	], function (	$, _, Backbone, vent,
                    UserList,
                    boxFriendsTemplate
				) { 

		var BoxFriendsView = Backbone.View.extend({ 
			template: _.template( boxFriendsTemplate ),

			initialize: function (options) { 
                this.friendDirectory = {};  // for making easier friend hrefs, maps email to eid, used for network ppl as well

                this.friendsCollection = new UserList([]);
                this.networkCollection = new UserList([]);
                if (options) { 
                    this.friendsCollection = options.friendsCollection;
                    this.networkCollection = options.networkCollection;
                    this.selfEid = options.selfEid;
                }
			}, 

            events: { 
                "click .friend-link": "showFriend",
                "click .network-link": "showNetworkUser",
            },

			render: function () { 
                $(this.el).html( this.template() );

                var view = this;
                var noShows = 0;
                if (this.friendsCollection && this.friendsCollection.length > 0) { 
                    var view = this;
                    this.friendsCollection.each( function (friend) { 
                        if (friend.get("eid") && friend.get("eid") != view.selfEid) {
                            friend.set({ areFriends: true });
                            view.friendDirectory[ friend.get("email") ] = friend;
                            view.addFriendLink(friend);
                        } else {
                            noShows++;
                        }
                    });

                } else {
                    $(".friends-list > ul", this.el).append("<li><h5>No friends yet.</h5></li>");
                }

                if (this.friendsCollection.length - noShows < 1) {
                    $(".friends-list > ul", this.el).append("<li><h5>No friends yet.</h5></li>");
                }

                noShows = 0;
                if (this.networkCollection && this.networkCollection.length > 0) { 
                    var view = this;
                    this.networkCollection.each( function (friend) { 
                        if (friend.get("eid") && friend.get("eid") != view.selfEid) {
                            friend.set({ areFriends: true });
                            view.friendDirectory[ friend.get("email") ] = friend;
                            view.addNetworkLink(friend);
                        } else { 
                            noShows++;
                        }
                    });

                } else {
                    $(".network-list > ul", this.el).append("<li><h5>No one shares your affiliation.</h5></li>");
                }

                if (this.networkCollection.length - noShows < 1) {
                    $(".network-list > ul", this.el).append("<li><h5>No one shares your affiliation.</h5></li>");
                }

                return this;
			},

            addFriendLink: function (friend) { 
                if (friend.online) { 
                    var linkTemplate = _.template( "<li><a class=\"friend-link online\" id=\"friend_" + friend.get("email") + "\"><%= firstName %> <%= lastName %><a></li>" );
                } else { 
                    var linkTemplate = _.template( "<li><a class=\"friend-link\" id=\"friend_" + friend.get("email") + "\"><%= firstName %> <%= lastName %><a></li>" );
                }
                $(".friends-list > ul", this.el).append( linkTemplate( friend.toJSON() ) );
            },

            addNetworkLink: function (user) { 
                var linkTemplate = _.template( "<li><a class=\"network-link\" id=\"friend_" + user.get("email") + "\"><%= firstName %> <%= lastName %><a></li>" );
                $(".network-list > ul", this.el).append( linkTemplate( user.toJSON() ) );
            },


            showFriend: function (e) { 
                vent.trigger( "showFriend", this.friendDirectory[(e.target.id).replace("friend_", "")]);
            },

            showNetworkUser: function (e) { 
                vent.trigger( "showFriend", this.friendDirectory[(e.target.id).replace("friend_", "")]);
            }
		});

		return BoxFriendsView;
	}
);

