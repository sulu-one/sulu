window.jQuery = require("./bower_components/jquery/dist/jquery.min.js");
//window.bootstrap = require("./bower_components/bootstrap/dist/js/bootstrap.min.js");


(function($, key) {

    var Clusterize = require("./bower_components/clusterize/clusterize.min.js");
	//cmd /K "cd C:\Windows\"

	var FileViewController = function(){
		this.activeView = 1;
		return this;
	};

	var Menu = function  (command) {
		var menu = [];
		var items = [];
		menu.push('<li class="dropdown">');
			menu.push('<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">' + command.menu + ' <span class="caret"></span></a>');
			items.push('<ul class="dropdown-menu" role="menu">');
				/*items.push('<li class="divider"></li>');
				items.push('<li><a href="#">Copy filename(s) with path <sup>strg+x</sup></a></li>');
				items.push('<li><a href="#">Copy filename(s) without path  <sup>strg+y</sup></a></li>');*/
			items.push('</ul>');
		menu.push('</li>');
		var $el = $(menu.join("\n"));
		var $items = $(items.join("\n"));
		$el.append($items);
		return {$el: $el, $items : $items};
	};

	var MenuItem = function(command){
		/*items.push('<li class="divider"></li>');
		items.push('<li><a href="#">Copy filename(s) with path <sup>strg+x</sup></a></li>');*/
		return $('<li><a href="javascript:void(0);">' + command.caption + '  <sup>' + command.key.toUpperCase() + '</sup></a></li>');
	};

	var MenuController = function() {
		this.menus = [];
		return this;
	};

	MenuController.prototype.add = function(command) {
		if (!this.menus[command.menu]){
			this.menus[command.menu] = new Menu(command);
			$("#main-menu").append(this.menus[command.menu].$el);
		}
		var menuItem = new MenuItem(command);
		this.menus[command.menu].$items.append(menuItem);
		return menuItem;
	};

	var Panda = function  () {
		this.plugins = [];
		this.menuController = new MenuController();
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
		  	row.push('<div class="row filesystemitem" data-isdirectory="' + file.isDirectory + '" data-filename="' + file.name + '">');
		    	row.push('<div class="col-xs-1"><span class="' + file.icon + '"></span></div>');
		    	row.push('<div class="col-xs-2"><span class="filesystemitem-filename">' + file.name + '</span></div>');
		    	row.push('<div class="col-xs-2">' + file.ext + '</div>');
		    	row.push('<div class="col-xs-2">' + (!file.isDirectory ? file.stats.size : "") + '</div>');
		    	row.push('<div class="col-xs-4">' + (file.stats.mtime || "").toString().replace("T", " ").replace(".000Z", "") + '</div>');
		    	row.push('<div class="col-xs-1">-a--</div>');
		  	row.push('</div>');

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

	Panda.prototype.getPluginById = function(id) {
		var result = null;
		for (var i = 0; i < this.plugins.length; i++) {
			var plugin = this.plugins[i];
			if (plugin.id === id){
				result = plugin;
				break;
			}
		}

		if (!result){
			throw "plugin " + id + " not found";
		}

		return result;
	};

	Panda.prototype.resolvePluginCommand = function(pluginId, methodName) {
		var plugin = this.getPluginById(pluginId);
		if (!plugin){
			throw "plugin " + pluginId + " not found";
		}

		var method = plugin[methodName];
		if (!method){
			throw "plugin method " + methodName + " not found";
		}

		return method;
	};

	Panda.prototype.resolvePluginCommandArguments = function(pluginId, command) {
		// TODO: 
		console.log("xxx");
	};

	Panda.prototype.registerPlugin = function(Plugin) {
		var plugin = new Plugin();
		this.registerMethods(plugin);
		/*if (plugin.init){
			plugin.init(function() {

			});
		}*/ 
	};

	Panda.prototype.registerMethods = function(plugin) {
		if (plugin.commands){
			this.plugins.push(plugin);
			for (var i = 0; i < plugin.commands.length; i++) {
				this.registerMethod(plugin, plugin.commands[i]);
			}
		}
	};

	Panda.prototype.registerMethod = function(plugin, command) {
    	var self = this;
    	var func = self.resolvePluginCommand(plugin.id, command.command);
    	var args = self.resolvePluginCommandArguments(command);
		var methodeCall = function(){
			return func(args);
			console.log(command);
		};

		self.menuController.add(command).click(function  () {
			return methodeCall();
		});
	    key(command.key, function(/*event, handler*/){
	    	return methodeCall();
	    });
	};

	if(!window.panda){
		window.panda = new Panda();
	}





var view = [];
var fs = require("fs");
var path = require("path");

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


})(jQuery, window.key);