define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"text!../../templates/box-friends.html",

	], function (	$, _, Backbone, vent,
                    UserStatus,
                    boxFriendsTemplate
				) { 

		var BoxFriendsView = Backbone.View.extend({ 
			template: _.template( boxFriendsTemplate ),

			initialize: function (options) { 
			}, 

            events: { 
            },

			render: function () { 
                $(this.el).html( this.template() );

                var view = this;
                this.collection.each( function (friend) { 
                    view.addFriendLink(friend);
                });
                return this;
			},

            addFriendLink: function (friend) { 
                var linkTemplate = _.template( "<li><%= friend.firstName %><%= friend.lastName %></li>" );
                $(".friends-list > ul", this.el).append( linkTemplate( friend.toJSON() ) );
            }
		});

		return BoxFriendsView;
	}
);

