var os = require("os");
var fs = require("fs");
var path = require("path");


var NPMC = function() {
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




NPMC.prototype.install = function(config, done){

	var exec = require('child_process').exec;
	process.cwd(__dirname);
	exec('npm install --prefix=' + config.prefix, function(err, stdout, stderr) {
		if (stderr){
			alert(stderr);
		}
  		done(stdout);
	  	//console.log(stdout);
	});
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
	this.npm.load(config, function (er, npm) {
		npm.commands.install([], done);
	});*/
};

module.exports = new NPMC();