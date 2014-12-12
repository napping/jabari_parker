define([
		"jquery",
		"underscore",
		"backbone",
		"events",
        "models/userStatuses",
		"text!../../templates/box-user.html",

	], function (	$, _, Backbone, vent,
                    UserStatus,
                    boxUserTemplate
				) { 

		var BoxUserView = Backbone.View.extend({ 
			template: _.template( boxUserTemplate ),

			initialize: function (options) { 
                this.statusEdit = false;
			}, 

            events: { 
                "click .user-status": "toggleStatus"
            },

			render: function () { 
                _.bind( this.saveStatus, { this: this} );

                $(this.el).html( this.template( this.model.toJSON() ) );

                return this;
			},

            toggleStatus: function () { 
                var view = this;
                if (!this.statusEdit) { 
                    console.log("Status is:", this.model.get("status"));
                    $(".user-status", this.el).html( "<input type=\"text\" value=\"" + this.model.get("status") + "\"></input" );

                    this.statusEdit = true;
                } 
                $(".user-status > input", this.el).focus().on( "blur", function () { 
                    view.saveStatus();
                });
            },

            saveStatus: function () { 
                var newText = $(".user-status > input").val();
                if (newText != this.model.get("status")) { 
                    var newStatus = new UserStatus({ "statusText": newText });

                    newStatus.save({
                        success: function (model, response, options) { 
                        },
                        error: function (model, response, options) { 
                        },
                    });
                }

                this.render();
                this.statusEdit = false;
            }
		});

		return BoxUserView;
	}
);

