var fs = require("fs");
var path = require("path");


var View = function(id) {
	this.id = id;
	this.path = path.join(__dirname, "examples");
	this.sep = require("path").sep;
	return this;
};


View.prototype.selected = function() {
	var result = [];
	for (var i = 0; i < this.data.length; i++) {
		if (this.data[i].selected){
			result.push(this.data[i]);
		}
	}
	return result;
};

View.prototype.dblclick = function(/*e*/) {
	var fileSystemItemDataRow = $(this);
	var filename = fileSystemItemDataRow.data("filename");
	var isDirectory = (fileSystemItemDataRow.data("isdirectory"));

	console.log(filename, isDirectory);

	if (isDirectory){
		var view = $(this).parents("element-core-data-view").data("controller");
		view.cd(filename);
		view.el.set("path", view.path.split(view.sep));
	}
	return false;
};

View.prototype.click = function(/*e*/) {
	var fileSystemItemDataRow = $(this);
	var fileSystemItemId = $(this).data("rowid");
	var view = $(this).parents("element-core-data-view").data("controller");
	view.data[fileSystemItemId].selected = !view.data[fileSystemItemId].selected;
	window.applicationController.GUI.activeView(view);

	fileSystemItemDataRow.toggleClass("selected");
};

View.prototype.renderRow = function(fileSystemItem) {
	var file = fileSystemItem;
	var row = [];
	row.push('<div style="position:relative" data-rowid="' + file.rowId + '" class="horizontal layout row filesystemitem' + (file.isDirectory ? " filesystemitem-directory" : "") + '" data-isdirectory="' + file.isDirectory + '" data-filename="' + file.name + '">');
		row.push('<div class="flex-1"><span class="' + file.icon + '"></span></div>');
		row.push('<div class="flex-7"><span class="filesystemitem-filename">' + file.name + '</span></div>');
		row.push('<div class="flex-1">' + file.ext + '</div>');
		row.push('<div class="flex-1">' + (!file.isDirectory ? file.stats.size : "") + '</div>');
		row.push('<div class="flex-1">' + (file.stats.mtime || "").toString().replace("T", " ").replace(".000Z", "") + '</div>');
		row.push('<div class="flex-1">-a--</div>');
		row.push('<paper-ripple></paper-ripple>');
	row.push('</div>');
	return row.join("\n");
};

View.prototype.renderRows = function(fileSystemItems) {
	var rows = [];
	for (var i = 0; i < fileSystemItems.length; i++) {
		var fileSystemItem = fileSystemItems[i];
		fileSystemItem.rowId = i;
		rows.push(this.renderRow(fileSystemItem));
	}
	return rows;
};

View.prototype.bind = function(){
	var self = this;
	if (!self.data){
		self.dir(function() {
			self.cluster = new window.Clusterize({
				rows: self.renderRows(self.data),
				scrollId: 'scrollArea' + self.id,
				contentId: 'contentArea' + self.id
			});
		});
	}
};

View.prototype.cd = function(dir){
	var self = this;
	this.path = path.join(this.path, dir);
	self.dir(function() {
		self.cluster.update(self.renderRows(self.data));
	});
};



View.prototype.mimeIconType = function(fileSystemItem) {
	var result = "";
	if (fileSystemItem.isDirectory){
		result = "fa fa-folder";
	} else {
		result = "fa fa-file-o";
		window.applicationController.events.emit("init-filesystem-item-icon", fileSystemItem);
		result = fileSystemItem.icon;
	}

	return result;
};



View.prototype.dir = function(done) {
	var self = this;

	console.log( self.id, "cdw", this.path );
	fs.readdir(self.path, function  (err, directoryContent) {
		if (err){
			console.error(err);
		} else {
			self.files = [];
			self.dirs = [];
			self.dirs.push({
				icon: "fa fa-level-up",
				path: path.join(self.path, ".."),
				stats:{size : 0, date: ""},
				name: "..",
				ext: "",
				isDirectory: true
			});

			for (var i = 0; i < directoryContent.length; i++) {
				var filename = directoryContent[i];

				var stats = {};
				try {
					stats = fs.statSync(path.join(self.path, filename));
				} catch(e){
					stats.isFile = function() {
						return true;
					}
				}

				var extension = path.extname(filename);
				var fileSystemItem = {
					//icon: "fa fa-file-o",
					path: this.path,
					stats: {size:stats.size, date:stats.mtime},
					name: path.basename(filename, extension),
					ext: extension,
					isDirectory: !stats.isFile()
				};

				fileSystemItem.icon = self.mimeIconType(fileSystemItem);
				if (fileSystemItem.isDirectory){
					self.dirs.push(fileSystemItem);
				} else {
					self.files.push(fileSystemItem);
				}
			}

			self.data = [];
			self.data.push.apply(self.data, self.dirs);
			self.data.push.apply(self.data, self.files);
			done();
		}
	});
};


module.exports = View;