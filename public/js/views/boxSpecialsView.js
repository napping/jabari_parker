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
                console.log("showing visualizer");
                $(".specials-body", this.el).html( _.template( visualizerTemplate )() );

                this.simulate();

            },

            showSearch: function () { 
                console.log("showing search");
                $(".specials-body", this.el).html( _.template( searchTemplate )() );
                $(".user-search").keypress( function(e) { 
                    var query = $(".user-search").val();
                    $(".search-results").empty();
                    if (query) { 
                        $.get( "/api/search/" + query, function (data) { 
                            var template = "<li><a href=\"#changePeekWall/<%= eid %>\"><p><%= firstName %> <%= lastName %></p></li>";

                            console.log(data, "data[i]--->", data[0]);
                            for (var i = 0; i < data.length; i++) { 
                                $(".search-results").append( _.template(template)(data[i]) );
                            }
                        }, "json");
                    }
                });
            },

            simulate: function () { 
                $(document).ready(function() {
                    $.getJSON('/api/visualizer', function (json) {
                        var infovis = document.getElementById('infovis');
                        var w = infovis.offsetWidth - 50, h = infovis.offsetHeight - 50;
                    //init Hypertree
                    var ht = new $jit.Hypertree({
                        //id of the visualization container
                        injectInto: 'infovis',
                        //canvas width and height
                        width: w,
                        height: h,
                        //Change node and edge styles such as
                        //color, width and dimensions.
                        Node: {
                            //overridable: true,
                            'transform': false,
                            color: "#f00"
                        },

                            Edge: {
                                //overridable: true,
                                color: "#088"
                            },
                            //calculate nodes offset
                            offset: 0.2,
                            //Change the animation transition type
                            transition: $jit.Trans.Back.easeOut,
                            //animation duration (in milliseconds)
                            duration:1000,
                            //Attach event handlers and add text to the
                            //labels. This method is only triggered on label
                            //creation

                            onCreateLabel: function(domElement, node){
                                domElement.innerHTML = node.name;
                                domElement.style.cursor = "pointer";
                                domElement.onclick = function() {
                                    $.getJSON('/api/visualizer/'+node.id, function(json) {
                                        ht.op.sum(json, {
                                            type: "fade:seq",
                                            fps: 30,
                                            duration: 1000,
                                            hideLabels: false,
                                            onComplete: function(){
                                                console.log("New nodes added!");
                                            }
                                        });
                                    });
                                }
                            },
                            //Change node styles when labels are placed
                            //or moved.
                            onPlaceLabel: function(domElement, node){
                                var width = domElement.offsetWidth;
                                var intX = parseInt(domElement.style.left);
                                intX -= width / 2;
                                domElement.style.left = intX + 'px';
                            },

                            onComplete: function(){
                            }
                        });
                        //load JSON data.
                        ht.loadJSON(json);
                        //compute positions and plot.
                        ht.refresh();
                        //end
                        ht.controller.onBeforeCompute(ht.graph.getNode(ht.root));
                        ht.controller.onAfterCompute();
                        ht.controller.onComplete();
                    });
                });
 
            },

            showRecommend: function () { 
                console.log("showing visualizer");
                $(".specials-body", this.el).html( _.template( "<h2>Unimplemented \:\( </h2>" )() );


            },
		});

		return BoxSpecialsView;
	}
);

