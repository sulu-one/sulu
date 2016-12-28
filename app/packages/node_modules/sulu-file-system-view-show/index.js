var Command = function() {
	return this;
}

Command.prototype.showItemInFolder = function showItemInFolder() {
	var v = this.GUI.activeView();
	if (v){
		const {shell} = require('electron');
		var view = this.GUI.activeView().model; 
		var file = view.activeRowData();  
		if (file){
			var path = require("path"); 
			var fn =  path.join(view.path, file.name) + file.ext;  
			shell.showItemInFolder(fn); 
			const { remote } = require('electron')
			remote.BrowserWindow.getFocusedWindow().minimize();
		} else {
			this.GUI.app.msg("please select a file.");
		}
	} else {
		this.GUI.app.msg("please select a file system view.");
	}
	return false; 
};

var Plugin = function (client) {
	this.command = new Command(); 
	client.app.registerHotKey("ctrl+e", this.command.showItemInFolder);
};

module.exports = Plugin;