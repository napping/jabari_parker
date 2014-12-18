define([
		"jquery",
		"underscore",
		"backbone",
		"events",
        "models/wallposts",
		"text!../../templates/box-wall.html",
		"text!../../templates/post.html",

	], function (	$, _, Backbone, vent,
                    WallPost,
                    boxWallTemplate, postTemplate
				) { 

		var BoxWallView = Backbone.View.extend({ 
			template: _.template( boxWallTemplate ),

			initialize: function (options) { 
                this.canPost = false;
                if (options) { 
                    if (options.canPost) { 
                        this.canPost = true;
                    }
                    if (options.ownerEid) { 
                        this.ownerEid = options.ownerEid;
                    }
                }
			}, 

            events: { 
                "click .submit-wallpost": "submitWallpost",
            },

			render: function () { 
                $(this.el).html( this.template({ canPost: this.canPost }));

                var view = this;
                this.collection.each( function (post) { 
                    view.addPost(post);
                });

                if (this.collection.length == 0) { 
                    $(".wall-posts > ul", this.el).append("<li><h5>No posts yet.</h5></li>");
                }

                return this;
			},

            addPost: function (post) { 
                var postHTML = _.template( postTemplate );

                $(".wall-posts > ul", this.el).append( postHTML( post.toJSON() ) );
            },

            submitWallpost: function () { 
                var text = $(".input-wallpost").val();
                var wallpost = new WallPost({ ownerEid: this.ownerEid, postText: text }); 
            }
		});

		return BoxWallView;
	}
);

