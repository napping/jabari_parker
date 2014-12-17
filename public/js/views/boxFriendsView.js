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
			}, 

            events: { 
            },

			render: function () { 
                $(this.el).html( this.template() );

                var view = this;
                console.log(this.collection);
                this.collection.fetch({
                    success: function (collection, response, options) {
                        this.collection.each( function (friend) { 
                            console.log("friend: ", friend);
                            view.addFriendLink(friend);
                        });
                    },
                    error: function (collection, response, options) { 

                    }
                });
                return this;
			},

            addFriendLink: function (friend) { 
                var linkTemplate = _.template( "<li><%= firstName %><%= lastName %></li>" );
                $(".friends-list > ul", this.el).append( linkTemplate( friend.toJSON() ) );
            }
		});

		return BoxFriendsView;
	}
);

