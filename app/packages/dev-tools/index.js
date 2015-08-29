var remote = require("remote");
var Command = function  () {
	return this;
};

Command.prototype.toggleDevTools = function toggleDevTools() {
	remote.getCurrentWindow().toggleDevTools();
	return false
};

var Plugin = function  (client) {
	this.command = new Command();
	client.app.registerHotKey("f12", this.command.toggleDevTools);
};

module.exports = Plugin;