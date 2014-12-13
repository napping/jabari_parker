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
			}, 

            events: { 
            },

			render: function () { 
                $(this.el).html( this.template( this.model.toJSON() ) );

                return this;
			},

            toggleStatus: function () { 
            },

            saveStatus: function () { 
            }
		});

		return BoxPeekView;
	}
);

