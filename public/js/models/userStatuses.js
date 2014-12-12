define([
		"jquery",
		"underscore",
		"backbone",
		"events",

	], function ($, _, Backbone, vent) { 
		var UserStatus = Backbone.Model.extend({ 
			defaults: { 
				statusText: "",
				timestamp: "None",
			},

			idAttribute: "statusEid",

			initialize: function () { 
				this.on("invalid", function (model, error) { 
					vent.trigger( "error", error );
				});
			},

			validate: function () { // not sure if necessary
				if ( !this.get("statusEid") ) { 
				    return "The status model requires an statusEid to be passed in.";
				}
			},

            url: function () { 
                return "/api/status/" + this.statusEid;
            }
				
		});
		
		return UserStatus;
	}
);

