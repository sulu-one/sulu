var Command = function() {
	return this;
}

Command.prototype.reload = function reload() {
	//const { remote } = require('electron')
	//remote.BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
	var v = this.GUI.activeView();
	if (v){
		const {shell} = require('electron');
		var view = this.GUI.activeView().model;
		view.refresh();
	} else {
		this.GUI.app.msg("please select a file system view.");
	}	
	return false; 
};

Command.prototype.reloadHard = function reloadHard() {
	const { remote } = require('electron')
	remote.BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
	return false; 
};

var Plugin = function (client) {
	this.command = new Command(); 
	client.app.registerHotKey("ctrl+r", this.command.reload);
	client.app.registerHotKey("f5", this.command.reload);
	client.app.registerHotKey("ctrl+f5", this.command.reloadHard);
};

module.exports = Plugin;