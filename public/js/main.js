requirejs.config({ 
    urlArgs: "bust=" + (new Date()).getTime(),  // TODO DEVELOPMENT ONLY, prevents caching

	baseURL: "static/js",

	shim:  {
		underscore: {
			exports: "_",
		},

		backbone: {
			deps: [ "underscore", "jquery" ],
			exports: "Backbone",
		},

		bootstrap: { 
			deps: [ "jquery" ],
		}
	},

	paths: { 
		jquery: "libs/jquery-2.1.1",
		underscore: "libs/underscore",
		backbone: "libs/backbone",
		text: "libs/text",
		alertify: "libs/alertify",
	},
});

require([
		"app",
	], function (app) { 
		app.start();
	}
);


