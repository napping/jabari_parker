define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"text!../../templates/skeleton.html",

	], function (	$, _, Backbone, vent,
					skeletonTemplate
				) { 

		var SkeletonView = Backbone.View.extend({ 
			template: _.template( skeletonTemplate ),

			className: "skeleton",	// for css styling

			initialize: function (options) { 
                this.loggedIn = options.loggedIn;
			}, 

			render: function () { 
				$(this.el).html( this.template({ loggedIn: this.loggedIn }) );

				return this;
			},
		});

		return SkeletonView;
	}
);

