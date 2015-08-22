var GUI = function(app) {
	this.app = app;
	this.app.registerHotKey("tab", this.toggleActiveView);
	return this;
};

GUI.prototype.toggleActiveView = function() {
	if (!this.GUI.source){
		this.GUI.activeView({id:"1"});
	} else {
		this.GUI.activeView(this.GUI.target.model);
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
				currentView.el.addClass("active");
			} else {
				self.target = currentView;
				currentView.el.removeClass("active");
			}
		});
	} else {
		return self.source;
	}
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