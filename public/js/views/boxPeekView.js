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

                if (!this.model.get("areFriends")) { 
                    this.model.set({ areFriends: this.areFriends });
                }
			}, 

            events: { 
                "click .button-add-friend": "addFriend",
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
                console.log("add friend clicked");
                if (this.areFriends == false) { 
                    console.log("not friends yet");

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

		});

		return BoxPeekView;
	}
);

