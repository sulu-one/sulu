var fs = require("fs");
var path = require("path");

var Command = function() {
	return this;
};

Command.prototype.createFile = function createFile() {
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
		var defaultText = (file ? file.name : "new_file");
		var self = this;
		this.GUI.dialogs.prompt("touch a file in \"" + view.path + "\"", defaultText, function(input) {
			if (input !== undefined){ 
				var shelljs = require('shelljs');
				shelljs.touch(input);
				var newFilename = path.join(view.path, input);
				view.refresh(newFilename, false);
			}
		});
	} else {
		this.GUI.app.msg("please select a file system view.");
	}
	return false;
};

var Plugin = function (client) {
	this.command = new Command(); 
	client.app.registerHotKey("ctrl+f7", this.command.createFile);
};

module.exports = Plugin;