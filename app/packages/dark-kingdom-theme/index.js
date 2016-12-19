var path = require("path");

var Plugin = function  (client) { 
	client.app.loadHTML(path.join(__dirname, "dk.html"));
	client.app.loadCSS(path.join(__dirname, "dk.css"));
};

module.exports = Plugin;