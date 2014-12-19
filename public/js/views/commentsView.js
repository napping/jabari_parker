define([
		"jquery",
		"underscore",
		"backbone",
		"events",
        "models/users",
		"text!../../templates/comments.html",

	], function (	$, _, Backbone, vent,
                    User,
                    commentsTemplate
				) { 

		var CommentsView = Backbone.View.extend({ 
			template: _.template( commentsTemplate ),

			initialize: function (options) { 
                console.log(options);
                this.data = [];
                if (options) { 
                    this.data = options.data;
                    this.parentEid = options.parentEid;
                }
			}, 

            events: { 
            },

			render: function () { 
                $(this.el).html( this.template({ parentEid: this.parentEid, data: [] }) );

                var view = this;
                for (var i = 0; i < this.data.length; i++) { 
                    view.appendComment(this.data[i]);
                }

                $(".enter-comment", this.el).keypress( function (e) { 
                    if (e.keyCode == 13) { 
                        var parentEid = (e.target.id).replace("enter-comment_", "");
                        var commentText = $("#" + e.target.id).val();
                        if (commentText) { 
                            view.postComment({ parentEid: parentEid, commentText: commentText });
                        }
                    }
                });
                return this;
			},

            appendComment: function (comment) { 
                var view = this;
                var templator = _.template( "<li><p><%= person1.firstName %> <%= person1.lastName %> commented: \"<%= commentText %>\".</p></li>" );

                var person1 = new User({ eid: comment.ownerEid });
                person1.fetch({ 
                    success: function (model) { 
                        comment["person1"] = model.toJSON();
                        $(".comments-ul", view.el).append( templator( comment ) );
                    },

                    error: function (model, response) { 
                        console.log("Error get status feed");
                        vent.trigger( "Error rendering some status feed items" );
                    }
                });
            },

            postComment: function (data) { 
                console.log("Posting comment:", data);
                $.ajax({ 
                    type: "POST",
                    url: "/api/comment",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function (response) { 
                        console.log("Successfully posted comment");
                        vent.trigger( "newComment", "Successfully posted comment" );
                        vent.trigger( "message", "Successfully posted comment" );
                    }
                });
            },
		});

		return CommentsView;
	}
);

