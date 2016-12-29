var path = require("path");
 
var Command = function() {
	return this;
}

Command.prototype.showBookmarks = function showBookmarks() {
	
	var v = this.GUI.activeView();
	var self = this;
	if (v){  
		var view = this.GUI.activeView().model;
		var bookmarks = self.config.settings.bookmarks; 
		view.refreshVirtual(bookmarks, true); 
	} else {
		this.GUI.app.msg("please select a file system view.");
	}
	return false;  

};

Command.prototype.toggleBookmark = function toggleBookmark() {
	var v = this.GUI.activeView();
	var self = this;
	if (v){
		const {shell} = require('electron');
		var view = this.GUI.activeView().model; 
		var file = view.activeRowData();  
		if (file){
			var path = require("path"); 
			var fn =  path.join(file.path, file.name) + file.ext; 
			var index = self.config.settings.bookmarks.indexOf(fn);
			if ( index === -1 ){ 
			 	self.config.settings.bookmarks.unshift(fn);
			} else {
				self.config.settings.bookmarks.splice(index, 1);
			}
			self.config.save();
			view.refresh();
		} else {
			this.GUI.app.msg("please select a file.");
		}
	} else {
		this.GUI.app.msg("please select a file system view.");
	}
	return false;  
};

function FileIcons(client){
	this.bookmarkClass = "fa fa-bookmark glow";
	this.init(client);
	return this;
}

FileIcons.prototype.init = function(client) {  
	client.app.config.settings.bookmarks = client.app.config.settings.bookmarks || [];
	client.app.events.on("init-filesystem-item-icon", this.getFileSystemItemIcon); 
	client.app.events.on("enter-filesystem-item", this.onEnterFileSystemItem.bind(client)); 
	
	this.command = new Command();
	client.app.registerHotKey("ctrl+b", this.command.toggleBookmark);
	client.app.registerHotKey("ctrl+shift+b", this.command.showBookmarks);
};

FileIcons.prototype.getFileSystemItemIcon = function(fileSystemItem){  
	if (fileSystemItem.bookmarked){
 		fileSystemItem.bookmarkClass = this.bookmarkClass;
	}
	return fileSystemItem;
};

FileIcons.prototype.onEnterFileSystemItem = function(fileSystemItem){
	var fn = (path.join(fileSystemItem.path, (fileSystemItem.name  || "")) + (fileSystemItem.ext || "")).toLowerCase();

	for (var i = 0; i < this.app.config.settings.bookmarks.length; i++) {
		var bm = this.app.config.settings.bookmarks[i];
		if (bm.toLowerCase() === fn){
			this.app.config.settings.bookmarks.splice(i, 1);
			this.app.config.settings.bookmarks.unshift(bm);
			this.app.config.save();
			break;
		}
	}
	fileSystemItem.preventDefault = false;
	return fileSystemItem;
};

module.exports = FileIcons;