var os = require("os");
var fs = require("fs");
var path = require("path");


var NPMC = function() {
	return this;
};

NPMC.prototype.nodeHomeFromPathEnvironment = function() {
	var p = process.env.PATH.split(";");
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
	this.npm = require(path.join(this.nodeHome(), "node_modules/npm/lib/npm.js"));
};

NPMC.prototype.install = function(config, done) {
	this.npm.load(config, function (er, npm) {
		npm.commands.install(["package.js"], done);
	});
};

module.exports = new NPMC();