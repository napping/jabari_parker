define([
		"jquery",
		"underscore",
		"backbone",
		"events",
        "models/users",
		"text!../../templates/box-feed.html",
		"text!../../templates/li-new-status.html",
		"text!../../templates/li-friendship.html",
		"text!../../templates/li-profile-update.html",
		"text!../../templates/li-wall-post.html",

	], function (	$, _, Backbone, vent,
                    User,
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
                switch (post.type) { 
                    case "status":
                        templator = _.template( liNewStatusTemplate );

                        var person1 = new User({ eid: post.ownerEid });
                        person1.fetch({ 
                            success: function (model) { 
                                post["person1"] = model.toJSON();
                                $(".news-feed > ul", view.el).append( templator( post ) );
                            },

                            error: function (model, response) { 
                                console.log("Error get status feed");
                                vent.trigger( "Error rendering some status feed items" );
                            }
                        });
                        break;

                    case "friendship":
                        var person1 = new User({ eid: post.ownerEid });
                        var person2 = new User({ eid: post.posterEid });
                        person1.fetch({
                            success: function (model) {
                                person2.fetch({
                                    success: function (model) {
                                        post["person1"] = person1.toJSON();
                                        post["person2"] = person2.toJSON();

                                        $(".news-feed > ul", view.el).append( templator( post ) );
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
                        var person1 = new User({ eid: post.ownerEid });
                        var person2 = new User({ eid: post.posterEid });
                        break;

                    case "profileUpdate":
                        templator = _.template( liProfileUpdateTemplate );

                        var person1 = new User({ eid: post.ownerEid });
                        person1.fetch({ 
                            success: function (model) { 
                                post["person1"] = model.toJSON();
                                $(".news-feed > ul", view.el).append( templator( post ) );
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

