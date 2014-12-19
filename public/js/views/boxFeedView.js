define([
		"jquery",
		"underscore",
		"backbone",
		"events",
        "models/users",
        "views/commentsView",
		"text!../../templates/box-feed.html",
		"text!../../templates/li-new-status.html",
		"text!../../templates/li-friendship.html",
		"text!../../templates/li-profile-update.html",
		"text!../../templates/li-wall-post.html",

	], function (	$, _, Backbone, vent,
                    User, CommentsView,
                    boxFeedTemplate, 
                    liNewStatusTemplate, liFriendshipTemplate, liProfileUpdateTemplate, liWallPostTemplate
				) { 

		var BoxFeedView = Backbone.View.extend({ 
			template: _.template( boxFeedTemplate ),

			initialize: function (options) { 
                this.data = [];
                if (options) { 
                    this.data = options.data;
                }
			}, 

            events: { 
            },

			render: function () { 
                $(this.el).html( this.template() );

                var view = this;
                for (var i = 0; i < this.data.length; i++) { 
                    view.appendPost(this.data[i]);
                }

                if (this.data.length == 0) { 
                    $(".news-feed > ul", this.el).append("<li><h5>No feed yet.</h5></li>");
                }

                return this;
			},

            appendPost: function (post) { 
                var view = this;
                var templator; 
                var comments;

                switch (post.type) { 
                    case "status":
                        templator = _.template( liNewStatusTemplate );

                        var person1 = new User({ eid: post.ownerEid });
                        person1.fetch({ 
                            success: function (model) { 
                                post["person1"] = model.toJSON();
                                $(".news-feed > ul", view.el).append( templator( post ) );

                                comments = JSON.stringify({eids: post.childEids});
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
                                            var commentsView = new CommentsView({
                                                data: data,
                                                parentEid: post.eid,
                                                place: "feed"
                                            });

                                            $("#comments-" + post.eid, view.el).html( commentsView.render().el );
                                        },
                                    });
                                } else { 
                                    $("#comments-" + post.eid, view.el).html( new CommentsView({ data: [], parentEid: post.eid, place: "feed" }).render().el );
                                }
                            },

                            error: function (model, response) { 
                                console.log("Error get status feed");
                                vent.trigger( "Error rendering some status feed items" );
                            }
                        });
                        break;

                    case "friendship":
                        templator = _.template( liFriendshipTemplate );

                        var person1 = new User({ eid: post.ownerEid });
                        var person2 = new User({ eid: post.posterEid });
                        person1.fetch({
                            success: function (model) {
                                person2.fetch({
                                    success: function (model) {
                                        post["person1"] = person1.toJSON();
                                        post["person2"] = person2.toJSON();

                                        $(".news-feed > ul", view.el).append( templator( post ) );
                                        comments = JSON.stringify({eids: post.childEids});

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
                                                    var commentsView = new CommentsView({
                                                        data: data,
                                                        parentEid: post.eid,
                                                        place: "feed"
                                                    });

                                                    $("#comments-" + post.eid, view.el).html( commentsView.render().el );
                                                },
                                            });
                                        } else { 
                                            $("#comments-" + post.eid, view.el).html( new CommentsView({ data: [], parentEid: post.eid, place: "feed" }).render().el );
                                        }


                                    },

                                    error: function (model, response) { 
                                        vent.trigger( "Error rendering some friendship feed items" );
                                    }
                                });
                            },

                            error: function (model, response) {
                                vent.trigger( "Error rendering some friendship feed items" );
                            }
                        });
                        break;

                    case "wallPost":
                        templator = _.template( liWallPostTemplate );

                        var person1 = new User({ eid: post.ownerEid });
                        var person2 = new User({ eid: post.posterEid });
                        person1.fetch({
                            success: function (model) {
                                person2.fetch({
                                    success: function (model) {
                                        post["person1"] = person1.toJSON();
                                        post["person2"] = person2.toJSON();

                                        $(".news-feed > ul", view.el).append( templator( post ) );

                                        comments = JSON.stringify({eids: post.childEids});
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
                                                    var commentsView = new CommentsView({
                                                        data: data,
                                                        parentEid: post.eid,
                                                        place: "feed"
                                                    });

                                                    $("#comments-" + post.eid, view.el).html( commentsView.render().el );
                                                },
                                            });
                                        } else { 
                                            $("#comments-" + post.eid, view.el).html( new CommentsView({ data: [], parentEid: post.eid, place: "feed" }).render().el );
                                        }


                                    },

                                    error: function (model, response) { 
                                        vent.trigger( "Error rendering some friendship feed items" );
                                    }
                                });
                            },

                            error: function (model, response) {
                                vent.trigger( "Error rendering some friendship feed items" );
                            }
                        });
 
                        break;

                    case "profileUpdate":
                        templator = _.template( liProfileUpdateTemplate );

                        var person1 = new User({ eid: post.ownerEid });
                        person1.fetch({ 
                            success: function (model) { 
                                post["person1"] = model.toJSON();
                                $(".news-feed > ul", view.el).append( templator( post ) );

                                comments = JSON.stringify({ eids: post.childEids });
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
                                            var commentsView = new CommentsView({
                                                data: data,
                                                parentEid: post.eid,
                                                place: "feed"
                                            });

                                            $("#comments-" + post.eid, view.el).html( commentsView.render().el );
                                        },
                                    });
                                } else { 
                                    $("#comments-" + post.eid, view.el).html( new CommentsView({ data: [], parentEid: post.eid, place: "feed" }).render().el );
                                }
                            },

                            error: function (model, response) { 
                                vent.trigger( "Error rendering some profile update feed items" );
                            }
                        });
 

                        break;

                }
            },

		});

		return BoxFeedView;
	}
);

