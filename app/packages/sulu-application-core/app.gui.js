/**
 * @copyright (c) 2016 Stephan Ahlf
 * @license MIT
 * @author Stephan Ahlf
*/
var path = require("path"); 
var Dialogs = require("dialogs"); 
var TimeController = require("time-controller");



/**
 * @class GUI
 * @param {ApplicationController} app - the ApplicationController
*/
var GUI = function(app) {
	var self = this;
	this.app = app;
	this.app.registerHotKey("tab", this.toggleActiveFileSystemView);
	this.app.registerHotKey("down", this.navigateToNextRow);
	this.app.registerHotKey("up", this.navigateToPreviousRow);
	this.app.registerHotKey("enter", this.enterActiveRow);
	this.app.registerHotKey("backspace", this.navigateToParentFolder);
	this.app.registerHotKey("space", this.selectActiveRow);
	this.app.registerHotKey("esc", this.unselectAllRows);
	this.app.registerHotKey("ctrl+a", this.selectAll);
	this.app.registerHotKey("ctrl+shift+a", this.invertSelection);
	this.app.registerHotKey("ctrl+s", this.selectByFileExtension);

	window.document.onkeydown = this.onKeyBoardInput.bind(this);
	this.debouncedKeyBoardInputTimer = new TimeController(this.onFilter, this).debounce(400);

	var dialogs = new Dialogs();
	this.dialogs = {
		prompt : function(text, defaultValue, done){
			window.document.onkeydown = null;
			dialogs.prompt(text, defaultValue, function(input) {
				window.document.onkeydown = self.onKeyBoardInput.bind(self);
				done(input);
			});
		}
	};
	return this;
 
}; 

GUI.prototype.onFilter = function onFilter() {
	var view = this.activeView();  
	var $filter = view.el.find(".filter").find("input"); 
	view.searchFilter = $filter.val().trim(); 
	var oldFile = view.model.activeRow;
	if (oldFile){
		oldfile = oldFile.data("filename")
	}
	view.model.cd(view.model.path, true, function(){
		if (view.searchFilter === ""){
			view.model.setActiveRowByFileName(oldfile);
		} else {
			var filteredData = [];
			for(var i = 0; i < view.model.data.length; i++){
				var item = view.model.data[i];
				var fn = item.name + item.ext;

				if (fn.toLowerCase().indexOf(view.searchFilter.toLowerCase()) >= 0){
					filteredData.push(path.join(item.path, item.name) + item.ext);
				};
			}

			view.model.refreshVirtual(filteredData, false, function(){
				view.model.setActiveRowByFileName(oldfile);
			});
		}
	});
}; 

GUI.prototype.onKeyBoardInput = function onKeyBoardInput(e) { 

	var keycode = e.keyCode;  
	var $filter = this.activeView().el.find(".filter").find("input");
    var printable = 
        (keycode > 47 && keycode < 58)   || // number keys
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);   // [\]' (in order)

	if (keycode === 13 || keycode === 27){
		$filter.val("");
		this.debouncedKeyBoardInputTimer(); 
	}

	if ((printable && !e.ctrlKey) || $filter.is(":focus")){
		$filter.focus();
		this.debouncedKeyBoardInputTimer(); 
	}

	return true;

}; 

 
/**
 * Mark active row of active file system view as selected.
*/
GUI.prototype.selectActiveRow = function selectActiveRow() {
	var view = this.GUI.source;
	view.model.selectActiveRow();
	view.model.el.set("selectedFileCount", view.model.selected().length);
	return false;
};

/**
 * Mark all rows of file system view.
*/
GUI.prototype.selectAll = function selectAll() { 
	var view = this.GUI.source;
	view.model.selectAll();
	view.model.refresh();
	view.model.el.set("selectedFileCount", view.model.selected().length); 
	return false;
};

/**
 * Invert selected rows of file system view.
*/
GUI.prototype.invertSelection = function invertSelection() { 
	var view = this.GUI.source;
	view.model.invertSelection();
	view.model.refresh();
	
	return false;
};

/**
 * Mark all rows of same filetype as selected.
*/
GUI.prototype.selectByFileExtension = function selectByFileExtension() { 
	var view = this.GUI.source;
	view.model.selectByFileExtension();
	view.model.refresh();
	return false;
};

/**
 * Mark all rows of active file system view as not selected.
*/
GUI.prototype.unselectAllRows = function unselectAllRows() {
	var view = this.GUI.source;
	view.model.unselectAllRows();
	view.model.refresh(); 
	view.el.find(".filter").find("input").val("");
	return false;
};

/**
 * Navigates to parent folder in active file system view.
*/
GUI.prototype.navigateToParentFolder = function navigateToParentFolder() {
	var view = this.GUI.source;
	view.model.cd("..");
};

/**
 * Navigates to active row in active file system view.
*/
GUI.prototype.enterActiveRow = function enterActiveRow() {
	var view = this.GUI.source;
	var row = view.model.row();
	view.model.activeRow.find("paper-ripple").animate()
	row.dblclick();
};

/**
 * Sets active row status to next row in active file system view.
*/
GUI.prototype.navigateToNextRow = function navigateToNextRow() {
	var nextRow = this.GUI.source.model.nextRow();

	if (this.GUI.source.model.isInView(nextRow)){
		return false;
	}
};

/**
 * Sets active row status to previous row in active file system view.
*/
GUI.prototype.navigateToPreviousRow = function navigateToPreviousRow() {
	var nextRow = this.GUI.source.model.previousRow();

	if (this.GUI.source.model.isInView(nextRow)){
		return false;
	}
};

/**
 * Toggles active file system view.
*/
GUI.prototype.toggleActiveFileSystemView = function toggleActiveFileSystemView() {
	if (!this.GUI.source){
		this.GUI.activeView({id:"1"});
	} else {
		this.GUI.activeView(this.GUI.target.model);//.model.row().click();
	}
	if (!this.GUI.activeView().model.activeRow){
		this.GUI.activeView().model.setFirstRowActive()
	}
	window.document.title = this.GUI.activeView().model.path;
	return false;
};

/**
 * Gets or sets the active file system view.
 * @param {View} view - the file-system-view
*/
GUI.prototype.activeView = function(view) {
	var self = this;
	if (view){
		$("element-core-data-view").each(function(/*i,n*/) {
			var model = $(this).data("controller");
			var currentView = {
				el   	: $(this),
				model 	: model
			};

			if (view.id === model.id){
				self.source = currentView;
				currentView.el.parent().addClass("active-filesystem-view");
				currentView.el.find(".clusterize-content").focus()
			} else {
				self.target = currentView;
				currentView.el.parent().removeClass("active-filesystem-view");
			}
		});
	}
	return self.source;
};

/**
 * Return the DOM and datamodel of all file system views.
*/
GUI.prototype.fileSystemViews = function() {
	var result = [];
	$("element-core-data-view").each(function(/*i,n*/) {
		result.push({
			el   	: $(this),
			model 	: $(this).data("controller")
		});
	});
	return result;
};

module.exports = GUI;