var Command = function() {
	return this;
}

Command.prototype.open = function open() {
	var v = this.GUI.activeView();
	if (v){
		var open = require('open');
		var view = this.GUI.activeView().model; 
		var file = view.activeRowData();  
		if (file){
			var path = require("path"); 
			var fn =  path.join(view.path, file.name) + file.ext;  
			this.GUI.app.msg("opening " + fn + "...");
			open(fn);
		} else {
			this.GUI.app.msg("please select a file.");
		}
	} else {
		this.GUI.app.msg("please select a file system view.");
	}
	return false; 
};

var Plugin = function  (client) {
	this.command = new Command();
	client.app.registerHotKey("f4", this.command.open);
};

module.exports = Plugin;