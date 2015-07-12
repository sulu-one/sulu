var os = require("os");
var fs = require("fs");
var path = require("path");


var NPMC = function() {
	this.packageMeta = require("./package.json");
	return this;
};

NPMC.prototype.nodeHomeFromPathEnvironment = function() {
	var p = process.env.PATH.split(";");
	if (p.length === 1){
		p = process.env.PATH.split(":");
	}
	var execFilename = "node";
	var result = null;

	if (os.platform().slice(0,3) === "win"){
		execFilename += ".exe";
	}

	for (var i = p.length - 1; i >= 0; i--) {
		var dir = p[i];
		var fn = path.join(dir, execFilename);

		if (fs.existsSync(fn)){
			result = dir;
			break;
		}
	}

	if(!result){
		throw "Node executable not found on system. Please install it from http://nodejs.org/";
	}

	return result;
};

NPMC.prototype.nodeHome = function(){
	var execPath = path.basename(process.execPath);
	var result = null;
	if (execPath === "node" || execPath === "node.exe"){
		result = path.dirname(process.execPath);
	} else {	// we are not in a node environment. Maybe electron or something else o.O
		result = this.nodeHomeFromPathEnvironment();
	}
	return result;
};

NPMC.prototype.init = function() {

	var npmModule = "npm.js";

	if (os.platform().slice(0,3) === "win"){
		npmModule = path.join(this.nodeHome(), "node_modules/npm/lib/npm.js");
	} else {
		npmModule = "/usr/lib/node_modules/npm/lib/npm.js";
	}

	this.npm = require(npmModule);
};


var DocumentEvent = function(eventName) {
	var event; // The custom event that will be created

	if (document.createEvent) {
		event = document.createEvent("HTMLEvents");
		event.initEvent(eventName, true, true);
	} else {
		event = document.createEventObject();
		event.eventType = eventName;
	}

	event.eventName = eventName;
	return event;
}

NPMC.prototype.install = function(config, done){

	var exec = require('child_process').exec;
	
	var modules = [];

	for(var moduleName in this.packageMeta.dependencies){
		if (this.packageMeta.dependencies.hasOwnProperty(moduleName)){
			modules.push(moduleName  + "@" + this.packageMeta.dependencies[moduleName]);
		}
	}

	var event = new DocumentEvent("mdl-componentupgraded");
	var moduleCount = modules.length;
	var self = this;
	var currentModule = 1;
	event.statusData = {
		progress 	: 0,
		buffer 		: 0,
		bufferStep 	: 100 / moduleCount
	};
	var $bootProgressBar = document.querySelector('#boot-progress-bar');
	if ($bootProgressBar){
		$bootProgressBar.dispatchEvent(event);
	}

	var installNextModule = function() {
		var module = modules.shift();
		console.log("installing module " + module);
		document.getElementById("boot-info-install-status-text").innerHTML = "Installing package " + (currentModule++ + " / " + moduleCount) + " <strong>" + module + "</strong>";
		event.statusData.buffer += event.statusData.bufferStep;
		if ($bootProgressBar){
			$bootProgressBar.dispatchEvent(event);
		}

		var tick = function(){
			event.statusData.progress += event.statusData.bufferStep;
			$bootProgressBar.dispatchEvent(event);
			if (modules.length === 0){
				done("Packages installed");
			} else {
				installNextModule();
			}
		}
/*
		exec('npm install --prefix=' + config.prefix + " " + module, function(err, stdout, stderr) {
			if (stderr){
				alert(stderr);
			}
			tick();
		});
*/
		self.npm.load(config, function (er, npm) {
			npm.commands.install([module], tick);
		});
/*
*/
	}

	installNextModule();
	/*

	*/
	/*
	FIXME: Spawn does not work?
	var spawn = require('child_process').spawn,
    ls    = spawn('npm', ['-v']);

	ls.stdout.on('data', function (data) {
	  console.log('stdout: ' + data);
	});

	ls.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});

	ls.on('close', function (code) {
	  console.log('child process exited with code ' + code);
	});*/

	// or if you want to send output elsewhere
	/*
	child.pipe(dest);
	FIXME: does not work?

	*/
};

module.exports = new NPMC();