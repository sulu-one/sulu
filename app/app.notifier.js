var ApplicationNotifier = function  (app) {
	this.app = app;
	this.ironOverlayClosed = function() {};
	document.querySelector('#dialog').addEventListener('iron-overlay-closed', this.ironOverlayClosed);
	return this;
};

ApplicationNotifier.prototype.msg = function(msg) {
	/*var notifier = require('node-notifier');
	notifier.notify(msg);*/
	document.querySelector('#toast').text = msg;
	document.querySelector('#toast').show();
};

ApplicationNotifier.prototype.dlg = function(settings, done) {
	var self = this;
	if (!settings.buttons){
		settings.buttons = {id: 0, text: "Cancel"}
	}

	var buttons = [];
	for (var i = 0; i < settings.buttons.length; i++) {
		var btn = settings.buttons[i];
		buttons.push('<paper-button dialog-confirm onclick="document.querySelector(\'#dialog\').action=\'' + btn.id + '\';" ' + (btn.autofocus ? 'autofocus' : '') + '>' + btn.text + '</paper-button>');
	}
	document.querySelector('#dialog-buttons').innerHTML = buttons.join("");

	var content = '<' + settings.polymerElementName + ' id="' + settings.polymerElementName + '"></' + settings.polymerElementName + '>';
	document.querySelector('#dialog-content').innerHTML = content;

	var dlg = document.querySelector('#dialog');
	dlg.removeEventListener('iron-overlay-closed', this.ironOverlayClosed);
	this.ironOverlayClosed = done;
	dlg.action = "-1";
	this.ironOverlayClosed = function(e) {
		var btnIndex = parseInt(e.target.action, 10);
		var model = $("#" + settings.polymerElementName).data("controller");
		if (done){
			var context = {event:e, result : btnIndex, model: model, app: self, el: this};
			done.bind(context)();
		}
		window.key.setScope("global");
		console.log("global");
	};
	dlg.addEventListener('iron-overlay-closed', this.ironOverlayClosed);
	window.key.setScope("modal-dialog");
	console.log("modal-dialog");
	dlg.open();
};


module.exports = ApplicationNotifier;