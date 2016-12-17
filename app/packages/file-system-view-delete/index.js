var Command = function() {
	return this;
}

Command.prototype.moveToTrash = function moveToTrash() {
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
			if (shell.moveItemToTrash(fn)){
	 			this.GUI.app.msg("deleted \"" + fn + "\"");
			} else {
	 			this.GUI.app.msg("failed to delete \"" + fn + "\"");
			}
		} 
		view.cd(view.path, true);
	}

	return false
};

var Plugin = function (client) {
	this.command = new Command(); 
	client.app.registerHotKey("del", this.command.moveToTrash);
};

module.exports = Plugin;