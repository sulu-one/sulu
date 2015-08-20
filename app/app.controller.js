var fs = require("fs");
var path = require("path");
var events = require('events');

var ApplicationNotifier = function  () {
	return this;
};

ApplicationNotifier.prototype.msg = function(msg) {
	var notifier = require('node-notifier');
	notifier.notify(msg);
};



var ApplicationCorePackageController = function(applicationController) {
	this.applicationController = applicationController;
	return this;
};

ApplicationCorePackageController.prototype.install = function() {
};



var ApplicationController = function(config) {
	this.config = config;

	if (fs.existsSync(path.join(__dirname, "config.js"))){
		this.settings = require(path.join(__dirname, "config.js"));
	} else {
		this.settings = {};
	}
	var applicationNotifier = new ApplicationNotifier();
	this.corePackageController = new ApplicationCorePackageController(this);
	this.msg = applicationNotifier.msg;
	this.events = new events.EventEmitter();
	return this;
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