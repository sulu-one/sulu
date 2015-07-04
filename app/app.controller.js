var fs = require("fs");
var path = require("path");
var npmc = require("./npmc.js"); // find NPM on the system



var ApplicationNotifier = function  () {
	return this;
};

ApplicationNotifier.prototype.msg = function(msg) {
	var notifier = require('node-notifier');
	notifier.notify(msg, function (err, response) {
	  // response is response from notification 
	});
/*
	notifier.on('click', function (notifierObject, options) {
	  // Happens if `wait: true` and user clicks notification 
	});

	notifier.on('timeout', function (notifierObject, options) {
	  // Happens if `wait: true` and notification closes 
	});
*/
};



var ApplicationCorePackageController = function(applicationController) {
	this.applicationController = applicationController;
	return this;
};

ApplicationCorePackageController.prototype.install = function() {
	try {
		npmc.init();
		npmc.install({prefix : path.join(__dirname)}, function(a,b,c) {
			var installedPackages = [];
			for (var k in c) {
				var pac = c[k].what;
				installedPackages.push(pac);
			}
			var icon = path.join(__dirname, "logo.jpg");
			console.log(icon);

			this.applicationController.msg({
				title: 'SULU Packages installed',
				message: installedPackages.join(", "),
				icon: icon, // absolute path (not balloons) 
				sound: false, // Only Notification Center or Windows Toasters 
				wait: true // wait with callback until user action is taken on notification 
			})

			window.setTimeout(function  (argument) {
				document.location.reload(true);
			},2000);
		});
	} catch (e) {
		alert(e);
		throw e;
	} finally {
	}
};



var ApplicationController = function() {
	var applicationNotifier = new ApplicationNotifier();
	this.corePackageController = new ApplicationCorePackageController(this);
	this.msg = applicationNotifier.msg;
	return this;
};

ApplicationController.prototype.requireAll = function() {
	var result = false;
	try{
		window.jQuery = window.$ = require("jquery");
		window.key = require("keymaster");
		window.Clusterize = require("clusterize.js");

		result = true;
	} catch (e) {
	}
	return result;
};

ApplicationController.prototype.initialize = function() {
	var result = this.requireAll();
	if (!result){
		this.corePackageController.install();
	}
	return result;
};


module.exports = new ApplicationController();