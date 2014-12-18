define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"models/users",

	], function ($, _, Backbone, vent, User) { 
		var UserList = Backbone.Collection.extend({ 
			model: User,

			idAttribute: "eid", // TODO DON't KNOW if THIS WILL WORK

			initialize: function (options) { 
                this.friendEids = options ? options.friendEids : [];
			},

			url: function () { 
				return "/api/batchProfile";	
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
		
		return UserList;
	}
);

