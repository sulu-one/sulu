var path = require("path");
//cmd /K "cd C:\Windows\"
window.resizeScrollViews = function function_name () {
	var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
	//    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

	var el = document.getElementsByClassName("clusterize-scroll");
	for (var i = 0; i < el.length; i++) {
	 	el[i].setAttribute("style","max-height:" + (y - 40) + "px");
	}
};

window.addEventListener("resize", window.resizeScrollViews);

var ApplicationController = require("./app.controller.js");
var applicationController = new ApplicationController({nodeModulesFolder: __dirname });
applicationController.loadCSS("app.css");
var remote = require('remote');
var Menu = remote.require('menu');
applicationController.mainMenu = [];
applicationController.loadCSS("node_modules/material-design-lite/material.min.css");
applicationController.loadJS("node_modules/material-design-lite/material.min.js");
applicationController.events.on("core-init-done", function(){});



window.Clusterize = require("clusterize.js");

window.onload = function appLoad() {
	if (applicationController.initialize()){

		applicationController.loadCSS(path.join(__dirname, "node_modules", "font-awesome", "css", "font-awesome.min.css"));
		/*config.app.loadCSS("node_modules/Select2/dist/css/select2.min.css");*/
		applicationController.loadHTML(path.join(__dirname, "bower_components", "polymer", "polymer.html"));
		//applicationController.loadHTML(path.join(__dirname, "element-test.html"));
		applicationController.loadHTML(path.join(__dirname, "element-data-view.html"));
		applicationController.loadCSS(path.join(__dirname, "node_modules", "clusterize.js", "clusterize.css"));

		applicationController.events.emit("init-main-menu", applicationController);
		var menu = Menu.buildFromTemplate(applicationController.mainMenu);
		Menu.setApplicationMenu(menu);
		applicationController.events.emit("init-gui", applicationController);
	}
};
