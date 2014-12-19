define([
		"jquery",
		"underscore",
		"backbone",
		"events",
        "models/wallposts",
        "models/users",
        "views/commentsView",
		"text!../../templates/box-wall.html",
		"text!../../templates/post.html",

	], function (	$, _, Backbone, vent,
                    WallPost, User, CommentsView,
                    boxWallTemplate, postTemplate
				) { 

		var BoxWallView = Backbone.View.extend({ 
			template: _.template( boxWallTemplate ),

			initialize: function (options) { 
                this.canPost = false;
                this.isOwner = false;
                if (options) { 
                    if (options.canPost) { 
                        this.canPost = true;
                    }
                    if (options.ownerEid) { 
                        this.ownerEid = options.ownerEid;
                    }
                    if (options.isOwner) { 
                        this.isOwner = options.isOwner;
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

                if (this.collection.length == 0) {  // TODO
                    $(".wall-posts > ul", this.el).append("<li><h5>No posts yet.</h5></li>");
                }

                return this;
			},

            addPost: function (post) { 
                var postHTML = _.template( postTemplate );

                var poster = new User({ eid: post.get("posterEid") });
                var view = this;
                poster.fetch({ 
                    success: function () { 
                        post.set({ 
                            firstName: poster.get("firstName"), 
                            lastName: poster.get("lastName"), 
                        });

                        if (view.isOwner) { 
                            $(".wall-posts > ul", ".box-user2").append( postHTML( post.toJSON() ) );
                        } else { 
                            $(".wall-posts > ul", ".box-peek2").append( postHTML( post.toJSON() ) );
                        }

                        comments = JSON.stringify({ eids: post.get("childEids") });
                        if (comments && comments.length > 0) {
                            $.ajax({ 
                                type: "POST",
                                url: "/api/batchEntity",
                                data: comments,
                                contentType: "application/json",
                                dataType: "json",
                                success: function (data) { 
                                    if (!data) { 
                                        data = [];
                                    }
                                    var place = view.isOwner ? "userWall" : "peekWall";
                                    var commentsView = new CommentsView({
                                        data: data,
                                        parentEid: post.get("eid"),
                                        place: place,
                                    });

                                    $("#comments-" + post.get("eid"), view.el).html( commentsView.render().el );
                                },
                            });

                        } else { 
                            $("#comments-" + post_get("eid"), view.el).html( new CommentsView({ data: [], parentEid: post.eid }).render().el );
                        }
                    },
                });
            },

            submitWallpost: function () { 
                var text = $(".input-wallpost").val();
                var wallpost = new WallPost({ ownerEid: this.ownerEid, postText: text }); 

                var view = this;
                wallpost.save({ ownerEid: this.ownerEid, postText: text }, {
                    success: function () {
                        vent.trigger( "newWallPost", view.ownerEid );
                    },

                    error: function () {
                    }
                });
            }
		});

		return BoxWallView;
	}
);

