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
                "click .user-status": "toggleStatus",
                "change .select-content-type": "handleSelect",
            },

			render: function () { 
                _.bind( this.saveStatus, { this: this} );

                $(this.el).html( this.template( this.model.toJSON() ) );

                $(".select-content-type").change( function () { 
                    console.log("changed");
                });

                return this;
			},

            toggleStatus: function () { 
                var view = this;
                if (!this.statusEdit) { 
                    $(".user-status", this.el).html( "<input type=\"text\" value=\"" + this.model.get("status") + "\" maxlength=\"65\"></input" );

                    this.statusEdit = true;
                } 

                $(".user-status > input", this.el).focus().unbind().bind( "keyup", function (e) { 
                    if (e.keyCode == 13) { 
                        view.saveStatus();
                    }
                });
                $(".user-status > input", this.el).focus().off( "blur" ).on( "blur", function () { 
                    view.saveStatus();
                });
            },

            saveStatus: function () { 
                var newText = $(".user-status > input", this.el).val();

                if (newText != this.model.get("status")) { 
                    var newStatus = new UserStatus({ statusText: newText });

                    var view = this;
                    newStatus.save( { statusText: newText }, { 
                        success: function (model) { 
                            vent.trigger( "message", "Successfully updated status." );
                            view.model.set({ status: model.get("statusText") });
                            view.render();
                        },
                        error: function () { 
                            view.render();
                            vent.trigger( "error", "Error updating status." );
                        }
                    });
                }
                this.render();

                this.statusEdit = false;
            },

            handleSelect: function () { 
                var selected = $(".select-content-type", this.el).val();
                switch (selected) { 
                    case "feed":
                        this.showFeed(this.model);
                        break;

                    case "wall":
                        this.showWall(this.model);
                        break;

                    case "photos":
                        this.showPhotos(this.model);
                        break;

                    case "edit":
                        this.showEdit(this.model);
                        break;

                }
            },

            showFeed: function (user) { 
                vent.trigger( "showFeed", user );
            },

            showWall: function (user) { 
                vent.trigger( "showWall", user );
            },

            showPhotos: function (user) { 
                vent.trigger( "showPhotos", user );
            },

            showEdit: function (user) { 
                vent.trigger( "showEdit", user );
            },

		});

		return BoxUserView;
	}
);

