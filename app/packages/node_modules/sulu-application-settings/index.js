var Command = function() {
	return this;
}

Command.prototype.settings = function settings() {
	const {shell} = require('electron');
 	var self = this;
	var v = this.GUI.activeView();
	if (v){
		v.model.cd(this.GUI.app.config.dataFolder, true, function(){
			v.model.setActiveRowByFileName(self.GUI.app.config.filename);
			self.GUI.app.msg("Press F4 to edit.");
		});
	} else {
		this.GUI.app.msg("please select a file system view.");
	}
	return false; 	
	
};

var Plugin = function  (client) {
	this.command = new Command();
	client.app.registerHotKey("ctrl+f12", this.command.settings);
};

module.exports = Plugin;