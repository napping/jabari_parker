define([
		"jquery",
		"underscore",
		"backbone",
		"events",

	], function ($, _, Backbone, vent) { 
		var User = Backbone.Model.extend({ 
			defaults: { 
				firstName: "John",
				lastName: "Smith",
                interests:  [ "None" ],
                interestsString: "None",
                affiliation: "None",
                birthday: "Unknown",
                status: "",
                statusEid: undefined,
                friendEids: [],
			},

			idAttribute: "eid",

			initialize: function () { 
				this.on("invalid", function (model, error) { 
					vent.trigger( "error", error );
				});

			},

			validate: function () { // not sure if necessary
			},

            url: function () { 
                if (typeof(this.get("eid")) != "undefined") {      // this is a specific call
                    return "/api/profile/" + this.get("eid");
                } else { 
                    return "/api/profile";
                }
            }
				
		});
		
		return User;
	}
);

