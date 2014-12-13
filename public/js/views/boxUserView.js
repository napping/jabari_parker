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
                    $(".user-status", this.el).html( "<input type=\"text\" value=\"" + this.model.get("status") + "\"></input" );

                    this.statusEdit = true;
                } 
                $(".user-status > input", this.el).focus().on( "blur", function () { 
                    view.saveStatus();
                });
                $(".user-status > input", this.el).keypress( function (e) { 
                    if (e.keyCode == 13) {
                        view.saveStatus();
                    }
                });
            },

            saveStatus: function () { 
                var newText = $(".user-status > input").val();

                if (true) { 
                    var newStatus = new UserStatus({ statusText: newText });

                    var view = this;
                    newStatus.save( { statusText: newText }, { 
                        success: function (model) { 
                            view.model.set({ status: model.get("statusText") });
                            view.render();
                        },
                        error: function () { 
                            view.render();
                            vent.trigger( "error", "Error updating status." );
                        }
                    });
                }

                this.statusEdit = false;
            }
		});

		return BoxUserView;
	}
);

