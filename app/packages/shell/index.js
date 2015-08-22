//var shell = require('shell');
var os = require('os');
var child_process = require('child_process');
var isWindows = (os.platform() === "win32" || os.platform() === "win64");

var Command = function() {
	return this;
}

Command.prototype.openShell = function openShell() {
	var view = this.GUI.activeView().model;
	if (isWindows){
		child_process.exec('start "' + view.path + '" /D "' + view.path + '"');
		this.msg("done");
	} else {
		this.msg(os.platform() + " not supported so far. o.O PLS CONTRIBUTE!");
	}

	return false
};

var Plugin = function  (client) {
	this.command = new Command();
	client.app.registerHotKey("ctrl+enter", this.command.openShell);
};

module.exports = Plugin;