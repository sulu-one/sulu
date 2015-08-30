/**
 * @copyright (c) 2015 Stephan Ahlf
 * @license MIT
 * @author Stephan Ahlf
*/



/**
 * @class GUI
 * @param {ApplicationController} app - the ApplicationController
*/
var GUI = function(app) {
	this.app = app;
	this.app.registerHotKey("tab", this.toggleActiveView);
	this.app.registerHotKey("down", this.setNextActiveRow);
	this.app.registerHotKey("up", this.setPreviousActiveRow);
	this.app.registerHotKey("enter", this.enterActiveRow);
	this.app.registerHotKey("backspace", this.backToParentFolder);
	this.app.registerHotKey("space", this.selectActiveRow);
	this.app.registerHotKey("esc", this.unselectAllRows);
	return this;
};


/**
 * Mark active row of active file system view as selected.
*/
GUI.prototype.selectActiveRow = function selectActiveRow() {
	var view = this.GUI.source;
	view.model.selectActiveRow();
	return false;
};

/**
 * Mark all rows of active file system view as not selected.
*/
GUI.prototype.unselectAllRows = function unselectAllRows() {
	var view = this.GUI.source;
	view.model.unselectAllRows();
	return false;
};

/**
 * Navigates to parent folder in active file system view.
*/
GUI.prototype.backToParentFolder = function backToParentFolder() {
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
GUI.prototype.setNextActiveRow = function setNextActiveRow() {
	var nextRow = this.GUI.source.model.nextRow();

	if (this.GUI.source.model.isInView(nextRow)){
		return false;
	}
};

/**
 * Sets active row status to previous row in active file system view.
*/
GUI.prototype.setPreviousActiveRow = function setPreviousActiveRow() {
	var nextRow = this.GUI.source.model.previousRow();

	if (this.GUI.source.model.isInView(nextRow)){
		return false;
	}
};

/**
 * Toggles active file system view.
*/
GUI.prototype.toggleActiveView = function GUI_toggleActiveView() {
	if (!this.GUI.source){
		this.GUI.activeView({id:"1"});
	} else {
		this.GUI.activeView(this.GUI.target.model);//.model.row().click();
	}
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