var path = require("path");
var npmc = require("./npmc.js");
npmc.init();

npmc.install(null /*{dir: path.join(__dirname, "node_modules")}*/, function  () {
	console.log(arguments);
});
