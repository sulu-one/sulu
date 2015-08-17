var path = require("path");
var remote = require('remote');

var initializeMainMenu = function(app) {

	var mnuView =   {
		label: 'View',
		submenu: [
			{
				label: 'Debugger',
				click: function() {
					remote.getCurrentWindow().openDevTools();
				},
				accelerator: 'F12'
		  	}
		]
	};

	var mnuHelp =   {
		label: 'Help',
		submenu: [
			{
				label: 'Documentation',
				click: function() {
					open("https://github.com/s-a/sulu/wiki");
				}
		  	},
		  	{
				label: 'Report a bug',
				click: function() {
					open("https://github.com/s-a/sulu/issues");
				}
		  	},
		  	{
				label: 'About',
				click: function() {
					open("http://s-a.github.io/sulu/");
				}
		  	},
		  	{
				type: 'separator'
		  	},
		  	{
				label: 'Source Code',
				click: function() {
					open("https://github.com/s-a/sulu");
				}
		  	},
		]
	};

	app.mainMenu.push(mnuView);
	app.mainMenu.push(mnuHelp);
};

var Package = function(config) {


	config.app.events.on("init-main-menu", initializeMainMenu);



    config.app.events.emit("core-init-done");


	return this;
};



module.exports = Package;