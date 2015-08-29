var path = require("path");

var Plugin = function  (client) {
	window.FileSystemView = require(path.join(__dirname, "file-system-view.js"));
	window.$ = require("jquery");

	client.app.loadHTML(path.join(__dirname, 'element-data-view.html'));
	client.app.loadHTML(path.join(__dirname, 'element-data-view-favourites.html'));
};

module.exports = Plugin;