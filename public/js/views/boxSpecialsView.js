define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"text!../../templates/box-specials.html",

	], function (	$, _, Backbone, vent,
                    boxSpecialsTemplate
				) { 

		var BoxSpecialsView = Backbone.View.extend({ 
			template: _.template( boxSpecialsTemplate ),

			initialize: function (options) { 
			}, 

            events: { 
            },

			render: function () { 
                $(this.el).html( this.template() );

                return this;
			},

		});

		return BoxSpecialsView;
	}
);

