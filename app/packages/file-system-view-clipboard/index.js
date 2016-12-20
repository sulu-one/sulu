const {clipboard} = require('electron');

var Command = function() {
	return this;
}

Command.prototype.copyFilenamesWithPath = function copyFilenamesWithPath() {
	var view = this.GUI.activeView().model;
	var selectedItems = view.selected();
	if (selectedItems.length === 0){
	 	this.GUI.app.msg("select some items to copy.");
	} else {
		var result = [];
		for (var i = selectedItems.length - 1; i >= 0; i--) {
			var item = selectedItems[i];
			result.push(path.join(item.path, item.name) + item.ext);
		} 
		clipboard.write({text: result.join("\r\n")});
		this.GUI.app.msg("copied " + selectedItems.length + " filenames with path to clipboard");
	}

	return false
};

Command.prototype.copyFilenamesWithExtendedInfo = function copyFilenamesWithExtendedInfo() {
	var view = this.GUI.activeView().model;
	var selectedItems = view.selected();
	if (selectedItems.length === 0){
	 	this.GUI.app.msg("select some items to copy.");
	} else {
		var result = [];
		for (var i = selectedItems.length - 1; i >= 0; i--) {
			var item = selectedItems[i];
			result.push(JSON.stringify(item));
		} 
		clipboard.write({text: result.join("\r\n")});
		this.GUI.app.msg("copied " + selectedItems.length + " filenames with path to clipboard");
	}

	return false
};

Command.prototype.copyFilenames = function copyFilenames() {
	var view = this.GUI.activeView().model;
	var selectedItems = view.selected();
	if (selectedItems.length === 0){
	 	this.GUI.app.msg("select some items to copy.");
	} else {
		var result = [];
		for (var i = selectedItems.length - 1; i >= 0; i--) {
			var item = selectedItems[i];
			result.push(item.name + item.ext);
		} 
		clipboard.write({text: result.join("\r\n")});
		this.GUI.app.msg("copied " + selectedItems.length + " filenames to clipboard");
	}

	return false
};

var Plugin = function (client) {
	this.command = new Command(); 
	client.app.registerHotKey("ctrl+y", this.command.copyFilenamesWithPath);
	client.app.registerHotKey("ctrl+shift+y", this.command.copyFilenames);
	client.app.registerHotKey("ctrl+shift+alt+y", this.command.copyFilenamesWithExtendedInfo);
};

module.exports = Plugin;