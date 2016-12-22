try{
	window.resizeScrollViews = function resizeScrollViews () {
		var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		//    x = w.innerWidth || e.clientWidth || g.clientWidth,
		y = w.innerHeight|| e.clientHeight|| g.clientHeight;

		var el = document.getElementsByClassName("clusterize-scroll");
		for (var i = 0; i < el.length; i++) {
			el[i].setAttribute("style","max-height:" + (y - 140) + "px");
		}
	};

	window.addEventListener("resize", window.resizeScrollViews);
	var path = require("path");
	var ApplicationController = require(path.join(__dirname, "packages/sulu-application-core/", "app.controller.js"));
	var applicationController = new ApplicationController({nodeModulesFolder: __dirname });
	window.Clusterize = require("clusterize.js");

	window.onload = function appLoad() {
		if (applicationController.initialize()){

			applicationController.events.emit("init-main-menu", applicationController);
			applicationController.events.emit("init-gui", applicationController);
			applicationController.events.on("core-init-done", function(){});
		}
	};
	require('electron').remote.getCurrentWindow().setMenu(null);   
} catch(e){
	const {dialog} = require('electron').remote; 
	var PrettyError = require('pretty-error');
	var pe = new PrettyError();
	pe.withoutColors();
	pe.skipNodeFiles(); // this will skip events.js and http.js and similar core node files
	pe.skipPackage('require'); // this will skip all the trace lines about express` core and sub-modules
	var renderedError = pe.render(e); 
	dialog.showErrorBox("title", renderedError);
}