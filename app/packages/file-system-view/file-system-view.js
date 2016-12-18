var fs = require("fs");
var path = require("path");
var drivelist = require('drivelist');

var View = function(id) {
	this.id = id;
	this.activeRow = null;
	this.path = path.join(__dirname, "examples");
	this.sep = require("path").sep;
	this.history = [this.path];
	return this;
};


/* Gets or sets active row */
View.prototype.row = function($row) {
	if ($row && $row.get(0)){
		if (this.activeRow){
			this.activeRow.removeClass("active");
		}
		this.activeRow = $row;
		this.activeRow.addClass("active");
	}
	this.activeRowId = this.activeRow.data("rowid");
	return this.activeRow;
};

View.prototype.isInView = function($elem) {
	var inView = false;
	if ($elem.get(0)){
		var id = "scrollArea" + this.id;
		var $scrollArea = $('#' + id);
		var docViewTop = $scrollArea.scrollTop();
		var docViewBottom = docViewTop + $scrollArea.height();
		var elemTop = $elem.get(0).offsetTop - $scrollArea.offset().top;
		var elemBottom = elemTop + $elem.height();
		inView = ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
		/*$('body').css('background', inView ? 'green' : 'tomato');
		console.log('=============')
		console.log('docViewTop', docViewTop);
		console.log('docViewBottom', docViewBottom);
		console.log('elemTop', elemTop);
		console.log('elemBottom', elemBottom);
		console.log('inView', inView);*/
	}
	return inView;
};
/*
function isScrolledIntoView(elem, divID){
	var docViewTop = $('#' + divID).scrollTop();
	var docViewBottom = docViewTop + $('#' + divID).height();
	var elemTop = $(elem).offset().top;
	var elemBottom = elemTop + $(elem).height();
	return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
*/

/* Sets and gets the next active row */
View.prototype.nextRow = function() {
	this.row(this.row().next());
	return this.row();
};

/* Sets and gets the previous active row */
View.prototype.previousRow = function() {
	this.row(this.row().prev());
	return this.row();
};

/* get selected rows */
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
	var id = parseInt(fileSystemItemDataRow.data("rowid"), 10);
	var filename = fileSystemItemDataRow.data("filename");
	/*var isDirectory = (fileSystemItemDataRow.data("directory"));
	var isDisk = (fileSystemItemDataRow.data("disk"));*/

	//console.log(filename, isDirectory);
	var view = $(this).parents("element-core-data-view").data("controller");
	var rowData = view.data[id];
	if (rowData.isDirectory || rowData.isDisk){
		var f = rowData.name;
		if (rowData.ext){
			f += rowData.ext;
		}
		console.log(f);
		view.cd(f);
	}

	return false;
};

View.prototype.selectActiveRow = function() {
	var id = this.activeRow.data("rowid");
	this.data[id].selected = !this.data[id].selected;
	this.activeRow.toggleClass("selected");
};

View.prototype.unselectAllRows = function() {
	this.activeRow.parent().find(".selected").removeClass("selected");
	for (var i = 0; i < this.data.length; i++) {
		var row = this.data[i];
		row.selected = false;
	}
};

View.prototype.click = function(/*e*/) {
	var fileSystemItemDataRow = $(this);
//	var fileSystemItemId = $(this).data("rowid");
/*	view.data[fileSystemItemId].selected = !view.data[fileSystemItemId].selected;
	fileSystemItemDataRow.toggleClass("selected");*/
	var view = $(this).parents("element-core-data-view").data("controller");
	window.applicationController.GUI.activeView(view);
	view.row(fileSystemItemDataRow);
//	view.cluster.update(view.renderRows(view.data));
};

View.prototype.renderRow = function(fileSystemItem) {
	var file = fileSystemItem;
	var row = [];
	row.push('<div style="position:relative" data-rowid="' + file.rowId + '" class="horizontal layout row filesystemitem' + (file.isDisk ? " filesystemitem-disk" : "") + (file.isDirectory ? " filesystemitem-directory" : "") + (file.selected ? " selected" : "") + '" data-isdirectory="' + file.isDirectory + '" data-filename="' + file.name + '">');
		row.push('<div class="flex-1"><span class="' + file.icon + '"></span></div>');
		row.push('<div class="flex-5"><span class="filesystemitem-filename">' + file.name + '</span></div>');
		row.push('<div class="flex-2">' + file.ext + '</div>');
		row.push('<div class="flex-2">' + (!file.isDirectory ? file.stats.size : "") + '</div>');
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
				contentId: 'contentArea' + self.id,
				afterInsertToDOM : function(data){
					var $scrollArea = $("#scrollArea" + self.id);
					if (!self.activeRow){
						self.activeRow = $scrollArea.find(".filesystemitem:first");
						self.activeRowId = parseInt(self.activeRow.data("rowid"), 10);
					}

					for (var i = 0; i < data.rows.length; i++) {
						var row = data.rows[i];
						var rowID = parseInt($(row).data("rowid"), 10);
						if (!isNaN(rowID)){
							var rowModel = self.data[rowID];
							if (rowModel.selected){
								$scrollArea.find("div[data-rowid='" + rowID + "']").addClass("selected");
							}
						}
					}

					if (self.activeRow){
						$scrollArea.find("div[data-rowid='" + (self.activeRowId) + "']").click();
					}
				}
			});
		});
	}
};

View.prototype.updateGridViewData = function(isHistoryJump){
	var self = this;
	self.cluster.update(self.renderRows(self.data));
	self.el.set("path", self.path.split(self.sep));
	self.el.set("xpath", []);
 	for(var i = 0; i < self.el.get("path").length; i++){ 
 		if (self.el.get("path")[i] !== "") {
			self.el.push("xpath", {
				folder : self.el.get("path")[i],
				path : self.el.get("path").slice(0, i + 1).join(self.sep) 
			});
 		}
	} 
	if (isHistoryJump === undefined){
		self.history.push(self.el.get("path").join(self.sep));
	} 
	self.setFirstRowActive();
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Bytes';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

View.prototype.cd = function(dir, isHistoryJump){
	var self = this;
	self.activeRow = null;
	self.activeRowId = null; 

	if (dir == "" || (!path.isAbsolute(dir) && dir === ".." && path.join(this.path, "..") === this.path)){
		// root of disc
		drivelist.list(function(error, disks) {
			if (error) {throw new Error(error);}
			console.log(disks);
			self.data = [];
			for (var i = 0; i < disks.length; i++) {
				var disk = disks[i];
				self.data.push({isDisk: true, icon: "fa fa-hdd-o", name: disk.mountpoint + self.sep, stats:{size: bytesToSize(disk.size)}/*, ext: disk.description*/});
			}
			self.updateGridViewData(isHistoryJump);
		});
	} else {
		if (path.isAbsolute(dir)){
			this.path = dir;
		} else {
			this.path = path.join(this.path, dir);
		}
		self.dir(function() {
			self.updateGridViewData(isHistoryJump);
		});
	}
};



View.prototype.setFirstRowActive = function(fileSystemItem) {
	var self = this;
	self.activeRowId = 0; 
	var $scrollArea = $("#scrollArea" + self.id);
	if (!self.activeRow){
		self.activeRow = $scrollArea.find(".filesystemitem:first");
		self.row(self.activeRow);
	}
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
	fs.readdir(self.path, function  (err, directoryContent) {
		if (err){
			console.error(err);
		} else {
			self.files = [];
			self.dirs = [];
			self.dirs.push({
				icon: "fa fa-level-up",
				path: path.join(self.path, ".."),
				stats:{size : bytesToSize(0), date: ""},
				name: "..",
				ext: "",
				isDirectory: true,
				idDisk: false
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
					stats: {size:bytesToSize(stats.size), date:stats.mtime},
					name: path.basename(filename, extension),
					ext: extension,
					isDirectory: !stats.isFile(),
					isdisk: false
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


View.prototype.pathLinkClick = function(e, detail) { 
	var p = e.target.parentElement.dataset.path; 
	if (p !== ""){
		p += this.sep;
	}
 	this.cd(p);
	e.preventDefault();
 
	console.log( this.id, "cdw", this.path );
	return false;
}; 

module.exports = View;