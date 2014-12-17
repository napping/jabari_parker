define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"models/wallposts",

	], function ($, _, Backbone, vent, Post) { 
		var NewsFeedList = Backbone.Collection.extend({ 
			model: Post,

			idAttribute: "eid", // TODO DON't KNOW if THIS WILL WORK

			initialize: function (options) { 
                this.eid = options.eid;
			},

			url: function () { 
				return "/api/newsfeed/";	
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
		
		return NewsFeedList;
	}
);

