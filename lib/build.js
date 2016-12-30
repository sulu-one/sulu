"use strict"

const path = require("path")
const builder = require("electron-builder")
const Platform = builder.Platform

var argv = require('minimist')(process.argv.slice(2));
console.dir();

var fs = require('fs');
var os = argv.os.toUpperCase() // "ia32"
var arch = argv.arch // "ia32"
var p = require("./../package.json");
var fn = path.join(__dirname, "../dist","sulu Setup " + p.version + ".exe");
var fn2 = path.join(__dirname, "../dist","sulu-fileexplorer-" + os + "-" + arch + "-" + p.version + "." + p.stability + ".exe");
var p2 = path.join(__dirname, "../app","package.json");


console.info("patch ", p2, p.version);
var pp2 = JSON.parse(fs.readFileSync(p2).toString())
pp2.version = p.version
pp2.description = p.description
fs.writeFileSync(p2, JSON.stringify(pp2, null, 4))

console.info("building to ", fn2);

// Promise is returned
builder.build({
  targets: Platform[os].createTarget(null, builder.Arch[arch]),
  config: {
    "compression": /*"store"*/"maximum",
    "asarUnpack" : "packages/**/*",
    "appId": "com.electron.sulu",
    "mac": {
      "category": "public.app-category.filesystem"
    },
    "win": {
    },
    "linux": {
      "category": "Utility"
    }
  }
}).then(() => {

	if (fs.existsSync(fn2)){
		fs.unlink(fn2, function(){
			fs.rename(fn, fn2, function(err) {
			  if ( err ) console.log('ERROR: ' + err);
			  console.log("done", fn2)
			});
		});
	} else {
		fs.rename(fn, fn2, function(err) {
		  if ( err ) console.log('ERROR: ' + err);
		  console.log("done", fn2)
		});
	}

}).catch((error) => {
  console.error(error)
})
