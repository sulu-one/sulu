var path = require("path");

var Command = function  () {
	return this;
};

Command.prototype.changeDirectory = function changeDirectory() {
	var self = this;
	this.GUI.dialogs.prompt("Enter new path", "", function(input) {
		if (input !== undefined){ 
			var view = self.GUI.activeView().model;
			view.cd(input);
		}
	});
};


Command.prototype.historyJumpBackward = function historyJumpBackward() {
	var view = this.GUI.activeView().model;
	var history = view.history;
	var activeHistoryIndex = history.length - 1;
	if (view.activeHistoryIndex !== undefined){ 
		activeHistoryIndex = view.activeHistoryIndex;
	}
	activeHistoryIndex--;

	if (activeHistoryIndex >= 0){
		var path = history[activeHistoryIndex];
		view.activeHistoryIndex = activeHistoryIndex;
		view.cd(path, true);
	 	this.GUI.app.msg("Jumped back to position " + (activeHistoryIndex + 1) + " of " + history.length);
	} else {
	 	this.GUI.app.msg("No more history items available");
	}

	return false
};

Command.prototype.historyJumpForward = function historyJumpForward() {
	var view = this.GUI.activeView().model;
	var history = view.history;
	var activeHistoryIndex = 0;
	if (view.activeHistoryIndex !== undefined){ 
		activeHistoryIndex = view.activeHistoryIndex;
	}
	activeHistoryIndex++;

	if (activeHistoryIndex < history.length){
		var path = history[activeHistoryIndex];
		view.activeHistoryIndex = activeHistoryIndex;
		view.cd(path, true);
	 	this.GUI.app.msg("Jumped forward to position " + (activeHistoryIndex + 1) + " of " + history.length);
	} else {
	 	this.GUI.app.msg("No more history items available");
	}
	return false
};

var Plugin = function  (client) {
	window.FileSystemView = require(path.join(__dirname, "file-system-view.js"));
	window.$ = require("jquery");

	client.app.loadHTML(path.join(__dirname, "element-data-view.html")); 

	this.command = new Command();
	// file properties - client.app.registerHotKey("alt+enter", this.command.historyJumpBackward);
	client.app.registerHotKey("ctrl+alt+left", this.command.historyJumpBackward);
	client.app.registerHotKey("ctrl+alt+right", this.command.historyJumpForward); 
	client.app.registerHotKey("right", this.command.changeDirectory); 
};

module.exports = Plugin;