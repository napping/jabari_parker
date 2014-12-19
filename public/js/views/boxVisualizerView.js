define([
		"jquery",
		"underscore",
		"backbone",
		"events",
        "models/users",
		"text!../../templates/box-visualizer",

	], function (	$, _, Backbone, vent,
                    User,
                    boxVisualizerTemplate
				) { 

		var BoxVisualizerView = Backbone.View.extend({ 
			template: _.template( boxVisualizerTemplate ),

			initialize: function (options) { 
			}, 

            events: { 
            },

            render: function () { 
                $(this.el).html( this.template() );

                this.loadVisualizer(this.model);

                return this;
            },

            loadVisualizer: function (user) {
/*
                var json = {
                    "id": user.get("eid"),
                    "name": user.get("firstName") + " " + user.get("lastName"),
                    "children": [],
                };

                var friendEids = user.get("friendEids") ? user.get("friendEids") : [];
                var friendsCollection = new UserList({ friendEids: friendEids });
                if (friendEids.length > 0) { 
                    friendsCollection.fetch({
                        type: "POST",

                        data: JSON.stringify({ eids: friendEids }),

                        contentType: 'application/json',

                        dataType: "json", 

                        success: function (collection, response, options) { 
                            var node = {
                                "id": user,
                                "name": user.get("firstName") + " " + user.get("lastName"),
                                "data": {},
                                "children": [],
                            };
                            json["children"].push(node);

                            collection.each( function (user) { 
                                var friendEids2 = user.get("friendEids") ? user.get("friendEids") : [];
                                var friendsCollection2 = new UserList({ friendEids: friendEids2 });
                                friendsCollection2.fetch({ 
                                    type: "POST",

                                    data: JSON.stringify({ eids: friendEids }),

                                    contentType: 'application/json',

                                    dataType: "json", 

                                    success: function (collection2) { 

                                    }
                                });
                            });
                        },

                        error: function (model, response, options) { 
                            vent.trigger( "error", "Could not get friends to make visualizer" );
                        }
                    });
                } else { 
                    vent.trigger( "message", "Yo, make some friends first!" );
                }

{"id": "vishwa","name": "Vishwa","children": [{
        "id": "andreas",
            "name": "Andreas",
            "data": {},
            "children": [{
            	"id": "boon",
            	"name": "Boon Thau Loo",
            	"data": {},
            	"children": []
            }, {
            	"id": "steve",
            	"name": "Steve Zdancewic",
            	"data": {},
            	"children": []
            }]
        }, {
            "id": "antonis",
            "name": "Antonis",
            "data": {},
            "children": [{
                "id":"andreas"
            }]
        }, {
            "id": "ang",
            "name": "Ang",
            "data": {},
            "children": []
        }, {
            "id": "peter",
            "name": "Peter",
            "data": {},
            "children": []
        }, {
            "id": "michael",
            "name": "Michael",
            "data": {},
            "children": []
        }, {
            "id": "sarah",
            "name": "Sarah",
            "data": {},
            "children": []
        }],
        "data": []
    };
*/
                $(document).ready(function() {
                    $.getJSON('/friendvisualization', function (json) {
                        console.log(json)
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
                                    $.getJSON('/getFriends/'+node.id, function(json) {
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

        });

		return BoxFeedView;
	}
);

