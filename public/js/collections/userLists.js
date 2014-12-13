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
			},

			url: function () { 
				return "/api/user/";	
			},
		});
		
		return UserList;
	}
);

