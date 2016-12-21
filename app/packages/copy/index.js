var path = require('path');


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
				/*cp -R {copy,shell} c:\temp*/
				var shelljs = require("shelljs");
				var selection = view.selected();
				var files = [];
				for (var i = selection.length - 1; i >= 0; i--) {
					var item = selection[i];
					files.push("\"" + path.join(item.path, item.name) + item.ext + "\"");
				}
				var target = this.app.GUI.target.model.path;
				var cmd = 'cp -R ' + files.join(" ") + " " + "\"" + target + "\"";
			  	console.debug(cmd);
			  	var self = this;
				shelljs.exec(cmd, {async:true}, function(code, stdout, stderr) {
					if (stderr){
					  	self.app.msg('Program stderr:', stderr);
					} else {
						self.app.msg(selectedFileSystemItems.length + " files copied. (" + self.result + ", " + self.model.copyFilePermissions + ")");
						self.app.GUI.target.model.refresh();
					}
				});
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