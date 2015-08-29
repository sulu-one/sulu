var fs = require("fs");
var path = require("path");
var events = require('events');
var ApplicationNotifier = require("./app.notifier.js");
var GUI = require("./app.GUI.js");

var ApplicationController = function(config) {
	this.config = config;

	if (fs.existsSync(path.join(__dirname, "config.js"))){
		this.settings = require(path.join(__dirname, "config.js"));
	} else {
		this.settings = {};
	}
	this.GUI = new GUI(this);
	var applicationNotifier = new ApplicationNotifier(this);
	this.msg = applicationNotifier.msg;
	this.dlg = applicationNotifier.dlg;
	this.events = new events.EventEmitter();

	return this;
};

ApplicationController.prototype.getFunctionName = function(fn) {
	var ret = fn.toString();
	ret = ret.substr('function '.length);
	ret = ret.substr(0, ret.indexOf('(')).trim();
	if (ret === "") {
		ret = null;
	}
	if (!ret){
		throw 'could not determine function name of \"' + fn.toString() + '\"';
	}
	return ret;
}

ApplicationController.prototype.registerHotKey = function(key, fn) {
	var n  = this.getFunctionName(fn);
	console.log(n);
	window.key(key, "global", fn.bind(this));
	window.key.setScope("global");
};

ApplicationController.prototype.fileSystemViews = function() {
	console.error("obsolete!", "use app.GUI.fileSystemViews", "instead");
};

ApplicationController.prototype.requireAll = function() {
	var result = false;
	try{
		window.key = require("keymaster");
		this.packageController = require("package.js");
		var folders = [path.join(__dirname, "packages")];
		this.packageController.autoload({
			debug: true,
			directories: folders,
			identify: function() {
				return (this.meta.suluPackage === true);
			},
			packageContstructorSettings: {app : this}
		});

		result = true;
	} catch (e) {
		console.log(e);
	}
	return result;
};

ApplicationController.prototype.loadCSS = function(path) {
	var head  = document.getElementsByTagName('head')[0];
	var link  = document.createElement('link');
	link.rel  = 'stylesheet';
	link.type = 'text/css';
	link.href = path;
	link.media = 'all';
	head.appendChild(link);
};

ApplicationController.prototype.loadHTML = function(path) {
	var head  = document.getElementsByTagName('head')[0];
	var link  = document.createElement('link');
	// link.id   = "cssId";
	link.rel  = 'import';
	link.href = path;
	head.appendChild(link);
};

ApplicationController.prototype.loadJS = function(path) {
	var head  = document.getElementsByTagName('head')[0];
	var script  = document.createElement('script');
	// link.id   = "cssId";
	script.type = 'text/javascript';
	script.src = path;
	head.appendChild(script);
};

ApplicationController.prototype.initialize = function() {
	var result = this.requireAll();
	return result;
};

module.exports = ApplicationController;