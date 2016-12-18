#!/usr/bin/env node

var electron = require("electron-prebuilt");
var proc = require("child_process");
var path = require("path");

var args = [
	path.join(__dirname, "app")
];

// spawn electron
var _proc = proc.spawn(electron, args);

_proc.on("close", function (code) {
	process.exit(code);
});
