requirejs.config({ 
    urlArgs: "bust=" + (new Date()).getTime(),  // TODO DEVELOPMENT ONLY, prevents caching

	baseURL: "/public/js",

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
		jquery: "libs/jquery",
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


