/*var child_process = require('child_process');*/


var Command = function() {
	return this;
}

Command.prototype.copy = function copy() {
	var view = this.GUI.activeView().model;
	var selectedFileSystemItems = view.selected();

	if (selectedFileSystemItems.length === 0){
		this.msg("No files selected");
	} else {
		var buttons = [
			{id: 0, text: "Copy only newer", autofocus: true},
			{id: 1, text: "Skip existing"},
			{id: 2, text: "Overwrite all"},
			{id: -1, text: "Cancel"}
		];

		this.dlg({polymerElementName: "polymer-cat", buttons: buttons}, function(){
			if (this.result !== -1){
				this.app.msg(selectedFileSystemItems.length + " files copied. (" + this.result + ", " + this.model.copyFilePermissions + ")");
				/*cp -R {copy,shell} c:\temp*/
				//child_process.execSync('start "SULU COPY" /D "c:\\temp" "cmd.exe" /K dir && cp --help');
			}
		});
	}

	return false
};

var Plugin = function  (client) {
	this.command = new Command();
	client.app.loadHTML(require("path").join(__dirname, 'polymer-cat.html'));
	client.app.registerHotKey("f5", this.command.copy);
};

module.exports = Plugin;