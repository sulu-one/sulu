var Command = function() {
	return this;
}

Command.prototype.showItemInFolder = function showItemInFolder() {
	var view = this.GUI.activeView().model;
	var selectedItems = view.selected();
	if (selectedItems.length === 0){
	 	this.GUI.app.msg("select some items to delete.");
	} else {
		const {shell} = require('electron');
		for (var i = selectedItems.length - 1; i >= 0; i--) {
			var item = selectedItems[i];
			var path = require("path"); 
			var fn =  path.join(view.path, item.name) + item.ext;  
			shell.showItemInFolder(fn); 
			const { remote } = require('electron')
			remote.BrowserWindow.getFocusedWindow().minimize();
			return false
		}  
	}
};

var Plugin = function (client) {
	this.command = new Command(); 
	client.app.registerHotKey("ctrl+e", this.command.showItemInFolder);
};

module.exports = Plugin;