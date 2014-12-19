define([
		"jquery",
		"underscore",
		"backbone",
		"events",
		"text!../../templates/box-specials.html",
		"text!../../templates/specials-visualizer.html",
		"text!../../templates/specials-search.html",
		"text!../../templates/specials-recommend.html",

	], function (	$, _, Backbone, vent,
                    boxSpecialsTemplate,
                    visualizerTemplate, searchTemplate, recomendTemplate 
				) { 

		var BoxSpecialsView = Backbone.View.extend({ 
			template: _.template( boxSpecialsTemplate ),

			initialize: function (options) { 
			}, 

            events: { 
                "change .specials-select": "handleSelect",
            },

			render: function () { 
                $(this.el).html( this.template() );

                return this;
			},


            handleSelect: function () { 
                var selected = $(".specials-select", this.el).val();
                switch (selected) { 
                    case "visualizer":
                        this.showVisualizer();
                        break;

                    case "search":
                        this.showSearch();
                        break;

                    case "recommend":
                        this.showRecommend();
                        break;
                }
            },

            showVisualizer: function () { 
            },

            showSearch: function () { 
                console.log("showing search");
                $(".specials-body", this.el).html( _.template( searchTemplate )() );
                $(".user-search").keypress( function(e) { 
                    var query = $(".user-search").val();
                    if (query) { 
                        $.get( "/api/search/" + query, function (data) { 
                            console.log(data);
                        });
                    }
                });
            },

            showRecommend: function () { 
            },
		});

		return BoxSpecialsView;
	}
);

