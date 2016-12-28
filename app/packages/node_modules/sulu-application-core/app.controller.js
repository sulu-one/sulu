/**
 * @copyright (c) 2016 Stephan Ahlf
 * @license MIT
 * @author Stephan Ahlf
*/ 
var path = require("path");
var events = require("events");
var ApplicationNotifier = require("./app.notifier.js");
var GUI = require("./app.GUI.js");


/**
 * @class ApplicationController
 * @param {Object} config - ApplicationController configuration
*/
var ApplicationController = function(config) {
	this.config = config;
	var Config = require("user-appdata");
	var config = new Config({appname : "sulu", defaultSettings : {
	}}); 
	config.settings.home = path.join(__dirname, "..", "..");
	config.save();
	this.config = config;
	this.GUI = new GUI(this);
	var applicationNotifier = new ApplicationNotifier(this);
	this.error = applicationNotifier.error;
	this.msg = applicationNotifier.msg;
	this.dlg = applicationNotifier.dlg;
	this.events = new events.EventEmitter();

	return this;
};


/**
* Determines if a function has a name.
* @param {function} fn - a JavaScript function
* @returns {String} The name of function
*/
ApplicationController.prototype.getFunctionName = function(fn) {
	var ret = fn.toString();
	ret = ret.substr("function ".length);
	ret = ret.substr(0, ret.indexOf("(")).trim();
	if (ret === "") {
		ret = null;
	}
	if (!ret){
		throw 'could not determine function name of \"' + fn.toString() + '\"';
	}
	return ret;
}

/**
* Registers a shortcut (https://github.com/madrobby/keymaster#supported-keys).
* @param {String} key - A comma seperated list of short cut keys.
* @param {function} fn - A named JavaScript function.
*/
ApplicationController.prototype.registerHotKey = function(key, fn) {
	var n  = this.getFunctionName(fn);
	
	console.info("press \"" + key + "\" to \"" + n + "\"");
	window.key(key, "global", fn.bind(this));
	window.key.setScope("global");
};
/*
ApplicationController.prototype.fileSystemViews = function() {
	console.error("obsolete!", "use app.GUI.fileSystemViews", "instead");
};
*/


/**
* Auto scans and loads installed packages.
*/
ApplicationController.prototype.requireAll = function() {
	var result = false;
	var meta;
	try{
		window.key = require("keymaster");
		this.packageController = require("package.js");
		var folders = [path.join(__dirname, "..")];
		 
		this.packageController.autoload({
			debug: true,
			directories: folders,
			identify: function() {
				meta = this.meta;
				return (this.meta.suluPackage === true);
			},
			packageContstructorSettings: {app : this}
		});

		result = true;
	} catch (e) {
		e.suluPackage = meta;
		this.error(e);
	}
	return result;
};

/**
* Import external CSS code file.
* @param {String} path - Relative or absulote path to file.
*/
ApplicationController.prototype.loadCSS = function(path) {
	var head  = document.getElementsByTagName("head")[0];
	var link  = document.createElement("link");
	link.rel  = "stylesheet";
	link.type = "text/css";
	link.href = path;
	link.media = "all";
	head.appendChild(link);
};

/**
* Import external HTML code file.
* @param {String} path - Relative or absulote path to file.
*/
ApplicationController.prototype.loadHTML = function(path) {
	var head  = document.getElementsByTagName("head")[0];
	var link  = document.createElement("link");
	// link.id   = "cssId";
	link.rel  = "import";
	link.href = path;
	head.appendChild(link);
};

/**
* Import external JavaScript code file.
* @param {String} path - Relative or absulote path to file.
*/
ApplicationController.prototype.loadJS = function(path) {
	var head  = document.getElementsByTagName("head")[0];
	var script  = document.createElement("script");
	// link.id   = "cssId";
	script.type = "text/javascript";
	script.src = path;
	head.appendChild(script);
};

ApplicationController.prototype.initialize = function() {
	var result = this.requireAll();
	return result;
};

module.exports = ApplicationController;