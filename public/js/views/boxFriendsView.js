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
                this.friendDirectory = {};  // for making easier friend hrefs, maps email to eid

			}, 

            events: { 
                "click a": "showFriend",
            },

			render: function () { 
                $(this.el).html( this.template() );

                var view = this;
                this.collection.each( function (friend) { 
                    friend.set({ areFriends: true });
                    view.friendDirectory[ friend.get("email") ] = friend;
                    view.addFriendLink(friend);
                });


                return this;
			},

            addFriendLink: function (friend) { 
                var linkTemplate = _.template( "<li><a class=\"friend-link\" id=\"friend_" + friend.get("email") + "\"><%= firstName %> <%= lastName %><a></li>" );
                $(".friends-list > ul", this.el).append( linkTemplate( friend.toJSON() ) );
            },

            showFriend: function (e) { 
                vent.trigger( "showFriend", this.friendDirectory[(e.target.id).replace("friend_", "")]);
            }
		});

		return BoxFriendsView;
	}
);

