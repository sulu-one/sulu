var GUI = function(app) {
	this.app = app;
	return this;
};

GUI.prototype.activeView = function(view) {
	var self = this;
	if (view){
		$("element-core-data-view").each(function(/*i,n*/) {
			var model = $(this).data("controller");
			var currentView = {
				el   	: $(this),
				model 	: model
			}
			if (view.id === model.id){
				self.source = currentView;
			} else {
				self.target = currentView;
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