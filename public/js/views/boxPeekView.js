define([
		"jquery",
		"underscore",
		"backbone",
		"events",
        "models/userStatuses",
		"text!../../templates/box-peek.html",

	], function (	$, _, Backbone, vent,
                    UserStatus,
                    boxPeekTemplate
				) { 

		var BoxPeekView = Backbone.View.extend({ 
			template: _.template( boxPeekTemplate ),

			initialize: function (options) { 
                this.areFriends = false;
                if (options && options.areFriends) { 
                    this.areFriends = true;
                }

                this.model.set({ areFriends: this.areFriends });
			}, 

            events: { 
                "click .button-add-friend": "addFriend",
            },

			render: function () { 
                $(this.el).html( this.template( this.model.toJSON() ) );

                return this;
			},

            addFriend: function () { 
                if (this.areFriends == false) { 

                }
            },

		});

		return BoxPeekView;
	}
);

