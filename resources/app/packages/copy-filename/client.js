(function($, panda) {

	var Plugin = function(){
		this.id = "copyFilename";
		return this;
	}

	Plugin.prototype.commands = [
		{
			"key": "ctrl+y",
			"menu" : "Edit",
			"contextMenuSelector" : ".selectedFiles",
			"caption" : "Copy filename with path",
			"command": "copyFilenameWithPath",
			"args": {"files": "panda.selectedFiles"},
		},
		{
			"key": "ctrl+x",
			"menu" : "Edit",
			"contextMenuSelector" : ".selectedFiles",
			"caption" : "Copy filename without path",
			"command": "copyFilenameWithoutPath",
			"args": {"files": "panda.selectedFiles"},
		}
	];

	Plugin.prototype.copyFilenameWithPath = function(fileArray) {
		console.log("copyFilenameWithPath");
	};

	Plugin.prototype.copyFilenameWithoutPath = function(fileArray) {
		console.log("copyFilenameWithoutPath");
	};

	Plugin.prototype.init = function() {
		console.log("init");
	};

	panda.registerPlugin(Plugin);

})(window.jQuery, window.panda);

