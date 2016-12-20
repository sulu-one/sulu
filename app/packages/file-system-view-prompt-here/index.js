var Command = function() {
	return this;
}

Command.prototype.openShell = function openShell() {
	var view = this.GUI.activeView().model;
	var PromtHere = new require("node-prompt-here");
	var promtHere = new PromtHere();
	promtHere.open(view.path);
	return false
};

var Plugin = function  (client) {
	this.command = new Command();
	client.app.registerHotKey("ctrl+enter", this.command.openShell);
};

module.exports = Plugin;