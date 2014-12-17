define([
		"jquery",
		"underscore",
		"backbone",
		"events",
        "models/wallposts",
		"text!../../templates/box-feed.html",
		"text!../../templates/post.html",

	], function (	$, _, Backbone, vent,
                    FeedModel,
                    boxFeedTemplate, postTemplate
				) { 

		var BoxFeedView = Backbone.View.extend({ 
			template: _.template( boxFeedTemplate ),

			initialize: function (options) { 
                if (options.ownerEid) { 
                    this.ownerEid = options.ownerEid;
                }
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

                $(".news-feed > ul", this.el).append( postHTML( post.toJSON() ) );
            },

		});

		return BoxFeedView;
	}
);

