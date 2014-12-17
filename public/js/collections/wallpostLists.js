define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"models/wallposts",

	], function ($, _, Backbone, vent, WallPost) { 
		var WallPostList = Backbone.Collection.extend({ 
			model: WallPost,

			idAttribute: "eid", // TODO DON't KNOW if THIS WILL WORK

			initialize: function (options) { 
                this.eid = options.eid;
			},

			url: function () { 
				return "/api/wall/" + this.eid;	
			},

            /*
            fetch: function () { 
                console.log("collection fetching");
                $.ajax({
                    type: "GET",

                    dataType: "json",

                    data: this.friendEids,

                    success: function (data) { 
                        console.log(data);

                        collection.reset(data);
                    }
                });
            },
           */

		});
		
		return WallPostList;
	}
);

