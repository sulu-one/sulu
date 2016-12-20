var Command = function() {
	return this;
}

Command.prototype.settings = function settings() {
	this.GUI.app.msg("opening " + fn + "...");
	const {shell} = require('electron');
	var fn = this.GUI.app.config.filename;
	shell.openItem(fn);
};

var Plugin = function  (client) {
	this.command = new Command();
	client.app.registerHotKey("ctrl+f12", this.command.settings);
};

module.exports = Plugin;