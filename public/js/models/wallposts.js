define([
		"jquery",
		"underscore",
		"backbone",
		"events",

	], function ($, _, Backbone, vent) { 
		var WallPost = Backbone.Model.extend({ 
			defaults: { 
				text: "",
                comments: [],
			},

			idAttribute: "eid",

			initialize: function () { 
			},

			validate: function () { // not sure if necessary
			},

            urlRoot: "/api/wallPost/",
				
		});
		
		return WallPost;
	}
);

