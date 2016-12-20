var fs = require("fs");
var path = require("path");

var Command = function() {
	return this;
};

Command.prototype.createFolder = function createFolder() {
	var mkdirSync = function (path) {
	  try {
	    fs.mkdirSync(path);
	  } catch(e) {
	    if ( e.code != 'EEXIST' ) {
	    	this.GUI.app.msg(e);
	    };
	  }
	};
	var v = this.GUI.activeView();
	if (v){
		const {shell} = require('electron');
		var view = this.GUI.activeView().model;
		var file = view.activeRowData(); 
		var defaultText = (file ? file.name : "new_folder");
		var self = this;
		this.GUI.dialogs.prompt("New folder in \"" + view.path + "\"", defaultText, function(input) {
			if (input !== undefined){ 
				mkdirSync(path.join(view.path, input));
				view.refresh(input);
			}
		});
	} else {
		this.GUI.app.msg("please select a file system view.");
	}
	return false;
};

var Plugin = function (client) {
	this.command = new Command(); 
	client.app.registerHotKey("f7", this.command.createFolder);
};

module.exports = Plugin;