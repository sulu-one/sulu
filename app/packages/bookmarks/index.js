 

function FileIcons(client){
	this.init(client);
	return this;
}

FileIcons.prototype.init = function(client) { 
	client.app.events.on("init-filesystem-item-icon", this.getFileSystemItemIcon); 
};

FileIcons.prototype.getFileSystemItemIcon = function(fileSystemItem){  
 	//fileSystemItem.bookmarkClass = "fa fa-bookmark glow"
	return fileSystemItem;
};

module.exports = FileIcons;