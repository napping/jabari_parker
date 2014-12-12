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
                interests:  [ "None"
                            ],
                affiliation: "None",
                birthday: "Unknown"
			},

			idAttribute: "eid",

			initialize: function () { 
				this.on("invalid", function (model, error) { 
					vent.trigger( "error", error );
				});
			},

			validate: function () { // not sure if necessary
				if ( !this.get("lastName") ) { 
					return "This answer choice is missing required attributes.  Please try again.";
				}
			},

            url: function () { 
                return "/api/profile";
            }
				
		});
		
		return User;
	}
);

