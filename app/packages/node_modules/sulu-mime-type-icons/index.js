var iconClasses = require("./file-extension-icon-classes.js");
var fileNameClasses = require("./file-name-icon-classes.js");

var FileIcons = function(client) {
	this.init(client);
	return this;
};

FileIcons.prototype.init = function(client) {
	client.app.events.on("init-filesystem-item-icon", this.getFileSystemItemIcon);
	client.app.loadCSS(require("path").join(__dirname, "font-awesome", "css", "font-awesome.min.css"));
	client.app.loadCSS(require("path").join(__dirname, "devicons", "devicon.min.css"));
	client.app.loadCSS(require("path").join(__dirname, "devicons", "devicon-colors.css"));
};

FileIcons.prototype.getFileSystemItemIcon = function(fileSystemItem) { 
	var result = "";


	if (fileSystemItem.isDirectory){
		if (fileSystemItem.isSymbolicLink === true){
			result = "fa fa-folder-o file-system-icon";
		} else {
			result = "fa fa-folder file-system-icon";
		}
	} else {
		var ext = fileSystemItem.ext.toLowerCase();
		var fn = fileSystemItem.name.toLowerCase() + ext; 
		result = fileNameClasses[fn] || iconClasses[ext] || "fa fa-file-o";
	} 
	if (!fileSystemItem.icon){ 
		fileSystemItem.icon  = result ; 
	}

	return fileSystemItem;
};

module.exports = FileIcons;