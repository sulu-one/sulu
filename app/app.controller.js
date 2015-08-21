var fs = require("fs");
var path = require("path");
var events = require('events');

var ApplicationNotifier = function  (app) {
	this.app = app;
	this.ironOverlayClosed = function() {};
	document.querySelector('#dialog').addEventListener('iron-overlay-closed', this.ironOverlayClosed);
	return this;
};

ApplicationNotifier.prototype.msg = function(msg) {
	/*var notifier = require('node-notifier');
	notifier.notify(msg);*/
	document.querySelector('#toast').text = msg;
	document.querySelector('#toast').show();
};

ApplicationNotifier.prototype.dlg = function(settings, done) {
	var self = this;
	if (!settings.buttons){
		settings.buttons = {id: 0, text: "Cancel"}
	}

	var buttons = [];
	for (var i = 0; i < settings.buttons.length; i++) {
		var btn = settings.buttons[i];
		buttons.push('<paper-button dialog-confirm onclick="document.querySelector(\'#dialog\').action=\'' + btn.id + '\';" ' + (btn.autofocus ? 'autofocus' : '') + '>' + btn.text + '</paper-button>');
	}
	document.querySelector('#dialog-buttons').innerHTML = buttons.join("");

	var content = '<' + settings.polymerElementName + ' id="' + settings.polymerElementName + '"></' + settings.polymerElementName + '>';
	document.querySelector('#dialog-content').innerHTML = content;

	var dlg = document.querySelector('#dialog');
	dlg.removeEventListener('iron-overlay-closed', this.ironOverlayClosed);
	this.ironOverlayClosed = done;
	dlg.action = "-1";
	this.ironOverlayClosed = function(e) {
		var btnIndex = parseInt(e.target.action, 10);
		var model = $("#" + settings.polymerElementName).data("controller");
		if (done){
			var context = {event:e, result : btnIndex, model: model, app: self, el: this};
			done.bind(context)();
		}
	};
	dlg.addEventListener('iron-overlay-closed', this.ironOverlayClosed);
	dlg.open();
};







var ApplicationController = function(config) {
	this.config = config;

	if (fs.existsSync(path.join(__dirname, "config.js"))){
		this.settings = require(path.join(__dirname, "config.js"));
	} else {
		this.settings = {};
	}
	var applicationNotifier = new ApplicationNotifier(this);
	this.msg = applicationNotifier.msg;
	this.dlg = applicationNotifier.dlg;
	this.events = new events.EventEmitter();
	return this;
};

ApplicationController.prototype.registerHotKey = function(key, fn) {
	window.key(key, fn.bind(this));
};

ApplicationController.prototype.fileSystemViews = function() {
	var result = [];
	$("element-core-data-view").each(function(/*i,n*/) {
		result.push({
			el   	: $(this),
			model 	: $(this).data("controller")
		});
	});
	return result;
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