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


GUI.prototype.selectActiveRow = function selectActiveRow() {
	var view = this.GUI.source;
	view.model.selectActiveRow();
	return false;
};

GUI.prototype.unselectAllRows = function unselectAllRows() {
	var view = this.GUI.source;
	view.model.unselectAllRows();
	return false;
};

GUI.prototype.backToParentFolder = function backToParentFolder() {
	var view = this.GUI.source;
	view.model.cd("..");
};

GUI.prototype.enterActiveRow = function enterActiveRow() {
	var view = this.GUI.source;
	var row = view.model.row();
	view.model.activeRow.find("paper-ripple").animate()
	row.dblclick();
};

GUI.prototype.setNextActiveRow = function setNextActiveRow() {
	var nextRow = this.GUI.source.model.nextRow();

	if (this.GUI.source.model.isInView(nextRow)){
		return false;
	}
};

GUI.prototype.setPreviousActiveRow = function setPreviousActiveRow() {
	var nextRow = this.GUI.source.model.previousRow();

	if (this.GUI.source.model.isInView(nextRow)){
		return false;
	}
};

GUI.prototype.toggleActiveView = function GUI_toggleActiveView() {
	if (!this.GUI.source){
		this.GUI.activeView({id:"1"});
	} else {
		this.GUI.activeView(this.GUI.target.model);//.model.row().click();
	}
	return false;
};

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