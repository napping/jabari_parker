define([
		"jquery",
		"underscore",
		"backbone",
		"events",

	], function ($, _, Backbone, vent) { 
		var UserStatus = Backbone.Model.extend({ 
			defaults: { 
				statusText: "",
			},

			idAttribute: "statusEid",

			initialize: function () { 
				this.on("invalid", function (model, error) { 
					vent.trigger( "error", error );
				});
			},

			validate: function () { // not sure if necessary
			},

            urlRoot: "/api/entity/"
				
		});
		
		return UserStatus;
	}
);

