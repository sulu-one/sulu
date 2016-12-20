var fs = require("fs");
var path = require("path");

var Command = function() {
	return this;
};

Command.prototype.rename = function rename() {
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
		var defaultText = (file ? (file.name + file.ext) : "new_folder");
		var self = this;
		var fnOld = path.join(file.path, file.name) + file.ext;
		this.GUI.dialogs.prompt("Rename \"" + fnOld + "\"", defaultText, function(input) {
			if (input !== undefined){ 
				var shell = require("shelljs");
				shell.mv([fnOld], path.join(file.path, input));
				view.refresh();
			}
		});
	} else {
		this.GUI.app.msg("please select a file system view.");
	}
	return false;
};

var Plugin = function (client) {
	this.command = new Command(); 
	client.app.registerHotKey("f2", this.command.rename);
};

module.exports = Plugin;