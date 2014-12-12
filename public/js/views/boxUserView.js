define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"text!../../templates/box-user.html",

	], function (	$, _, Backbone, vent,
                    boxUserTemplate
				) { 

		var SkeletonView = Backbone.View.extend({ 
			template: _.template( boxUserTemplate ),

			initialize: function (options) { 
			}, 

			render: function () { 
				$(this.el).html( this.template( this.model.toJSON() ) );

				return this;
			},
		});

		return SkeletonView;
	}
);

