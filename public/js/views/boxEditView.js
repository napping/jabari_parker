define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"text!../../templates/box-edit.html",

	], function (	$, _, Backbone, vent,
                    boxEditTemplate
				) { 

		var BoxEditView = Backbone.View.extend({ 
			template: _.template( boxEditTemplate ),

			initialize: function (options) { 
                this.statusEdit = false;
			}, 

            events: { 
                "click .submit-edit": "saveEdit",
            },

			render: function () { 
                this.model.set({ "interestsString": this.model.get("interests").join(", ") });

                $(this.el).html( this.template( this.model.toJSON() ) );

                return this;
			},

            saveEdit: function () { 
                var newFirstName = $("#change-first-name", this.el).val();
                var newLastName = $("#change-last-name", this.el).val();
                var newAffiliation = $("#change-affiliation", this.el).val();
                var newInterests = $("#change-interests", this.el).val().split(", ");

                this.model.set({ 
                    firstName: newFirstName,
                    lastName: newLastName,
                    affiliation: newAffiliation,
                    interests: newInterests,
                });

                var view = this;
                this.model.save( {}, { 
                    success: function (model, response, options) { 
                        vent.trigger( "message", "Updated your profile." );
                        vent.trigger( "renderProfile", "edit" );
                        view.render();
                    },

                    error: function (model, response, options) { 
                        vent.trigger( "error", "There was an error in updating your profile." );
                        view.render();
                    }

                });

                this.render();

                this.statusEdit = false;
            },

		});

		return BoxEditView;
	}
);

