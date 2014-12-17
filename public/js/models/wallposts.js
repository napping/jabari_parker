define([
		"jquery",
		"underscore",
		"backbone",
		"events",

	], function ($, _, Backbone, vent) { 
		var WallPost = Backbone.Model.extend({ 
			defaults: { 
				postText: "",
                comments: [],
                owner: "An unknown person",
			},

			idAttribute: "eid",

			initialize: function (options) { 
                if (options.ownerEid) { 
                    this.ownerEid = options.ownerEid;
                }
			},

			validate: function () { // not sure if necessary
			},

            urlRoot: function () {  // for posting, the GETS are handled in batches
                return "/api/wallPost/" + this.ownerEid;
            },
				
		});
		
		return WallPost;
	}
);

