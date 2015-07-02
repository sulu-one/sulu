var Test = function  (argument) {
	return this;
};

Test.prototype.helloWorld = function(text) {
	document.body.style.background = "yellow";
	document.title = "helloWorld("+text+")";
	return text;
};

exports.Test = Test;