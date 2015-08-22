var Plugin = function  (client) {
	client.app.loadCSS(require("path").join(__dirname, 'dk.css'));
};

module.exports = Plugin;