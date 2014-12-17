define([
		"jquery",
		"underscore",
		"backbone",
		"events",
        "models/userStatuses",
		"text!../../templates/box-peek.html",

	], function (	$, _, Backbone, vent,
                    UserStatus,
                    boxPeekTemplate
				) { 

		var BoxPeekView = Backbone.View.extend({ 
			template: _.template( boxPeekTemplate ),

			initialize: function (options) { 
                this.areFriends = false;
                if (options && options.areFriends) { 
                    this.areFriends = true;
                }
                console.log(this.areFriends);

                if (!this.model.get("areFriends")) { 
                    this.model.set({ areFriends: this.areFriends });
                }
                console.log(this.areFriends);
			}, 

            events: { 
                "click .button-add-friend": "addFriend",
                "change .select-content-type": "handleSelect",
            },

			render: function () { 
                if (this.model) { 
                    $(this.el).html( this.template( this.model.toJSON() ) );
                } else { 
                    $(this.el).html( "<h3>Creep Window</h3>" );
                }

                return this;
			},

            addFriend: function () { 
                if (this.areFriends == false) { 

                    var view = this;
                    $.post( "/api/friend/" + this.model.get("eid"), function (data) { 
                        console.log( data );

                        view.areFriends = true;
                        view.render();
                    });
                } else { 
                    console.log("removing friend");

                    var view = this;
                    $.post( "/api/unfriend/" + this.model.get("eid"), function (data) { 
                        console.log( data );

                        view.areFriends = false;
                        view.render();
                    });
 
                }
            },

            handleSelect: function () { 
                var selected = $(".select-content-type", this.el).val();
                switch (selected) { 
                    case "wall":
                        this.showWall(this.model);
                        break;

                    case "photos":
                        this.showPhotos(this.model);
                        break;
                }
            },

            showWall: function (user) { 
                vent.trigger( "showPeekWall", user );
            },

            showPhotos: function (user) { 
                vent.trigger( "showPeekPhotos", user );
            },


		});

		return BoxPeekView;
	}
);

