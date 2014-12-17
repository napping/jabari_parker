define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"text!../../templates/box-wall.html",
		"text!../../templates/post.html",

	], function (	$, _, Backbone, vent,
                    boxWallTemplate, postTemplate
				) { 

		var BoxWallView = Backbone.View.extend({ 
			template: _.template( boxWallTemplate ),

			initialize: function (options) { 
			}, 

            events: { 
            },

			render: function () { 
                $(this.el).html( this.template() );

                var view = this;
                this.collection.each( function (post) { 
                    view.addPost(post);
                });


                return this;
			},

            addPost: function (post) { 
                var postHTML = _.template( postTemplate );

                $(".wall-posts > ul", this.el).append( postHTML( post.toJSON() ) );
            },

		});

		return BoxWallView;
	}
);

