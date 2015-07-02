//var path = require("path")

var Plugin = function(config) {
	config.app.resource.add(__dirname, "client.js");
	return this;
};

module.exports = Plugin;