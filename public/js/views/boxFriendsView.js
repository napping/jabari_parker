define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"text!../../templates/box-friends.html",

	], function (	$, _, Backbone, vent,
                    boxFriendsTemplate
				) { 

		var BoxFriendsView = Backbone.View.extend({ 
			template: _.template( boxFriendsTemplate ),

			initialize: function (options) { 
                this.friendDirectory = {};  // for making easier friend hrefs, maps email to eid, used for network ppl as well

			}, 

            events: { 
                "click .friend-link": "showFriend",
            },

			render: function () { 
                $(this.el).html( this.template() );

                if (this.friendsCollection && this.friendsCollection.length > 0) { 
                    var view = this;
                    this.friendsCollection.each( function (friend) { 
                        friend.set({ areFriends: true });
                        view.friendDirectory[ friend.get("email") ] = friend;
                        view.addFriendLink(friend);
                    });

                } else {
                    $(".friends-list > ul", this.el).append("<li><h5>No friends yet.</h5></li>");
                }

                if (this.networkCollection && this.networkCollection.length > 0) { 
                    var view = this;
                    this.networkCollection.each( function (friend) { 
                        friend.set({ areFriends: true });
                        view.friendDirectory[ friend.get("email") ] = friend;
                        view.addNetworkLink(friend);
                    });

                } else {
                    $(".network-list > ul", this.el).append("<li><h5>No one shares your affiliation.</h5></li>");
                }

                return this;
			},

            addFriendLink: function (friend) { 
                var linkTemplate = _.template( "<li><a class=\"friend-link\" id=\"friend_" + friend.get("email") + "\"><%= firstName %> <%= lastName %><a></li>" );
                $(".friends-list > ul", this.el).append( linkTemplate( friend.toJSON() ) );
            },

            addNetworkLink: function (user) { 
                var linkTemplate = _.template( "<li><a class=\"friend-link\" id=\"friend_" + user.get("email") + "\"><%= firstName %> <%= lastName %><a></li>" );
                $(".network-list > ul", this.el).append( linkTemplate( user.toJSON() ) );
            },


            showFriend: function (e) { 
                vent.trigger( "showFriend", this.friendDirectory[(e.target.id).replace("friend_", "")]);
            }
		});

		return BoxFriendsView;
	}
);

