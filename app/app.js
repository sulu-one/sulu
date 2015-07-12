var fs = require("fs");
var path = require("path");
//var npmc = require("./npmc.js"); // find NPM on the system


	var readDirectoyContents = function(req, callback) {

		var summary = {
			folders:0,
			files:0,
			size:0
		};
		var viewIndex = parseInt(req.view);

		var newDir = view[viewIndex].dir;
		if (req && req.cd){
			newDir = path.join(view[viewIndex].dir, req.cd);
		}
		console.log( req.view, "cdw", newDir );
		fs.readdir(newDir, function  (err, directoryContent) {
			if (err){
				console.error(err);
			} else {
				var files = [];
				var dirs = [];
				dirs.push({
					icon: "fa fa-level-up",
					path: path.join(newDir, ".."),
					stats:{size:0, date:""},
					name: "..",
					ext: "",
					isDirectory: true
				});

				for (var i = 0; i < directoryContent.length; i++) {
					var filename = directoryContent[i];
					var stats = fs.statSync(path.join(newDir, filename));

					var extension = path.extname(filename);
					var fileSystemItem = {
						//icon: "fa fa-file-o",
						path: newDir,
						stats: {size:stats.size, date:stats.mtime},
						name: path.basename(filename, extension),
						ext: extension,
						isDirectory: !stats.isFile()
					};
					
					fileSystemItem = initFileSystemItemIcon(fileSystemItem);
					//console.log(fileSystemItem);
					if (fileSystemItem.isDirectory){
						dirs.push(fileSystemItem);
					} else {
						files.push(fileSystemItem);
					}
				}
				dirs.push.apply(dirs, files);
			
				view[viewIndex].dir = newDir;
		  		callback({summary:summary, items:dirs, viewIndex: viewIndex});
			}
		});
	};


	//cmd /K "cd C:\Windows\"

	var FileViewController = function(){
		this.activeView = 1;
		return this;
	};

	var Panda = function  () {
		this.plugins = [];
		this.fileViewController = new FileViewController(this);
		var self = this;
		$(function() {
			self.init();
		});
		return this;
	};

	var view1 = null;
	var view2 = null;
	var initialize = function  (fsItems, summary, viewIndex) {
		// JavaScript
		var data = [];
		for (var i = 0; i < fsItems.length; i++) {
			var file = fsItems[i];
		  	var row = [];
		  	row.push('<tr class="row filesystemitem" data-isdirectory="' + file.isDirectory + '" data-filename="' + file.name + '">');
		    	row.push('<td class="mdl-data-table__cell--non-numeric"><span class="' + file.icon + '"></span></td>');
		    	row.push('<td class="mdl-data-table__cell--non-numeric"><span class="filesystemitem-filename">' + file.name + '</span></td>');
		    	row.push('<td class="mdl-data-table__cell--non-numeric">' + file.ext + '</td>');
		    	row.push('<td class="mdl-data-table__cell--non-numeric">' + (!file.isDirectory ? file.stats.size : "") + '</td>');
		    	row.push('<td class="mdl-data-table__cell--non-numeric">' + (file.stats.mtime || "").toString().replace("T", " ").replace(".000Z", "") + '</td>');
		    	row.push('<td class="mdl-data-table__cell--non-numeric">-a--</td>');
		  	row.push('</tr>');

		  	data.push(row.join(""));
		}
		console.log("viewIndex", viewIndex);
		if (viewIndex === 1){
			if (view1){
				view1.update(data);
			} else {
				view1 = new Clusterize({
				  rows: data,
				  scrollId: 'scrollArea1',
				  contentId: 'contentArea1'
				});
			}
		} else {
			if (view2){
				view2.update(data);
			} else {
				view2 = new Clusterize({
				  rows: data,
				  scrollId: 'scrollArea2',
				  contentId: 'contentArea2'
				});
			}
		}
	};


	Panda.prototype.refreshGui = function() {
		$(".file-view").removeClass("file-view-active");
		$(".file-view-" + this.fileViewController.activeView).addClass("file-view-active");
	};


	Panda.prototype.initGUIEvents = function() {
		var self = this;
		var filesystemitemDblClick = function(e) {
			var activeView = 2;
			if ($(e.target).parents(".file-view:first").hasClass("file-view-1")){
				activeView = 1;
			}

			self.fileViewController.activeView = activeView;

			var fileSystemItemDataRow = $(e.target).parents(".filesystemitem:first");
			fileSystemItemDataRow.toggleClass("filesystemitem-selected");
			var filename = fileSystemItemDataRow.data("filename");
			var isDirectory = (fileSystemItemDataRow.data("isdirectory"));
			 
			console.log(filename, isDirectory);

			if (isDirectory){
/*				$.getJSON("/fs", {cd: filename, view: activeView}, function(fs) {
					initialize(fs.items, fs.summary, fs.viewIndex);
				});
*/				
				readDirectoyContents({cd: filename, view: activeView}, function(fs) {
					initialize(fs.items, fs.summary, fs.viewIndex);
				});
			}
			self.refreshGui();
		};

		$( document ).on( "dblclick", ".filesystemitem", {}, filesystemitemDblClick);   
		//$( document ).on( "click", ".filesystemitem", {}, filesystemitemClick);   
	};

	Panda.prototype.init = function() {
		this.initGUIEvents();
		this.refreshGui();
		//$.getScript( "/plugins", function( data, textStatus, jqxhr ) {});
		
		readDirectoyContents({view:1}, function(fs) {
			initialize(fs.items, fs.summary, fs.viewIndex);
		});
		readDirectoyContents({view:2}, function(fs) {
			initialize(fs.items, fs.summary, fs.viewIndex);
		});
		//$.getJSON("/fs", );

/*
		$.getJSON("/fs", {view:2}, function(fs) {
			initialize(fs.items, fs.summary, fs.viewIndex);
		});
*/
		var self = this;

	    key("tab", function(/*event, handler*/){
	    	if (self.fileViewController.activeView === 1){
	    		self.fileViewController.activeView = 2;
	    	} else {
				self.fileViewController.activeView = 1;
	    	}
	    	self.refreshGui();
	    	return false;
	    });

	};

	Panda.prototype.selectedFiles = function() {
		return ["mock"];
	};






var view = [];

view[1] = {};
view[2] = {};
view[1].dir = path.join(__dirname, /*"..", */ "examples");
view[2].dir = path.join(__dirname, /*"..", */ "examples");
var initFileSystemItemIcon = function(fileSystemItem) {
	var result = "";
	if (fileSystemItem.isDirectory){
		result = "fa fa-folder";
	} else {
		result = "fa fa-file-o";
	}

	fileSystemItem.icon = result;
	/////this.events.emit("init-filesystem-item-icon", fileSystemItem);
	//console.log(fileSystemItem.icon, fileSystemItem.name);
	return fileSystemItem;
};




var ApplicationController = require("./app.controller.js");
var applicationController = new ApplicationController({nodeModulesFolder: __dirname });

applicationController.loadCSS("app.css");
var remote = require('remote');
var Menu = remote.require('menu');
applicationController.mainMenu = [
];


//applicationController.app = app; // Module to control application life.
//applicationController.window = window.mainWindow;



	applicationController.loadCSS("node_modules_fallback/material-design-lite/material.min.css");
	applicationController.loadJS("node_modules_fallback/material-design-lite/material.min.js");
	applicationController.loadCSS("node_modules_fallback/look-at-this/dist/look-at-this.min.css");


	applicationController.events.on("core-init-done", function(){
		$(function  () {
			$("#boot-info").fadeOut("fast", function(){
				$("#workspace").removeClass("hidden").hide().fadeIn("fast");
			});
		})
	});


window.onload = function function_name (argument) {
	if (applicationController.initialize()){

		var X = require("./node_modules_fallback/look-at-this/dist/look-at-this.min.js");
		window.socialIcons.setup.githubUrl = "https://github.com/s-a/sulu/";
		/* TODO */
		//window.socialIcons.setup.media = "http://s-a.github.io/look-at-this/responsive-showcase.gif";
		window.socialIcons.setup.url = "http://s-a.github.io/sulu/";
		window.socialIcons.setup.title = "SULU - A Hackable Filesystem Manager";
		/*
			var test = require("./node_modules/Select2/dist/js/select2.full.min.js");
			var data = [
				{ id: 0, text: 'enhancement' }, 
				{ id: 1, text: 'bug' }, 
				{ id: 2, text: 'duplicate' }, 
				{ id: 3, text: 'invalid' }, 
				{ id: 4, text: 'wontfix' }
			];

			$(document).ready(function() {
				$("#command-palette").select2({
				 	tags: "false",
					placeholder: "Select a state",
					data: data,
				 	theme: "classic"
				}).on("select2:select", function(){
					document.title = $(this).val();
					$(this).val(null).trigger("change");
				}).val(null).trigger("change");
			});
		*/
		$("#boot-info-text").html("<h1>Loading packages...</h1>");

		applicationController.events.emit("init-main-menu", applicationController);
		var menu = Menu.buildFromTemplate(applicationController.mainMenu);
		Menu.setApplicationMenu(menu);



		applicationController.events.emit("init-gui", applicationController);

		console.log("sulu done.");
	}
}