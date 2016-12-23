var path = require("path");


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
		  		var win = window.open("consoleWindow.html"); 
				var started = false;
		  		var readyEventListener = function (event) {
			        if ( event.data === "rdy") {
			            run();
			        }
			    };
				window.addEventListener("message", readyEventListener, false);

			  	var self = this;
				var run = function() { 
					if(started) return;
					started = true;
					var shelljs = require("shelljs");
					var selection = view.selected();
					var files = [];
					for (var i = selection.length - 1; i >= 0; i--) {
						var item = selection[i];
						files.push("\"" + path.join(item.path, item.name) + item.ext + "\"");
					}
					var target = self.app.GUI.target.model.path;
					var cmd = "cp -r " + files.join(" ") + " " + "\"" + target + "\"";
				  	console.debug(cmd);

					win.eval("log('<span>' + " + JSON.stringify(cmd) + " + '...<span>')");
					var child = shelljs.exec(cmd, {async:true}, function(code,out,err){ 
						if (out !== ""){
							win.eval("log('<span>' + " + JSON.stringify("done") + " + '<span>')");						
						}
						if (err !== ""){
							win.eval("log('<span class=error>' + " + JSON.stringify("done") + " + '<span>')");
						}
						if (err === "" && out === ""){
							win.eval("log('<span>' + " + JSON.stringify("ok") + " + '<span>')");						
							win.close()
						}
						self.app.GUI.target.model.refresh();
					});
					child.stdout.on("data", function(data) {
						window.removeEventListener("message", readyEventListener);
						win.eval("log('<span>' + " + JSON.stringify(data) + " + '<span>')");
					});				
					child.stderr.on("data", function(data) {
						window.removeEventListener("message", readyEventListener);
						win.eval("log('<span class=error>' + " + JSON.stringify(data) + " + '<span>')");
					});
					child.on("close", function(data) {
						window.removeEventListener("message", readyEventListener);
						win.eval("log('<span>' + " + JSON.stringify("close") + " + '<span>')");
					});
					//child_process.execSync('start "SULU COPY" /D "c:\\temp" "cmd.exe" /K dir && cp --help');
				}
			}
		});
	}

	return false
};

var Plugin = function  (client) {
	this.command = new Command();
	client.app.loadHTML(require("path").join(__dirname, "polymer-cat.html"));
	client.app.registerHotKey("f5", this.command.copy);
};

module.exports = Plugin;