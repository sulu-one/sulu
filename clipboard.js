var $ = require('nodobjc')

var paths = ['c:\\git\\sulu\\clipboard.js', 'c:\\git\\sulu\\Gruntfile.js']
copyFilesToClipboard(paths);

function copyFilesToClipboard (paths) {

	$.framework('Foundation')
	$.framework('AppKit')

	var pasteboard = $.NSPasteboard('generalPasteboard');
	var changeCount = pasteboard('clearContents');
	var filesToCopy = $.NSMutableArray('alloc')('init');

	paths.forEach(function (image) {
		var string = $.NSString('stringWithUTF8String', image);
		filesToCopy('addObject', $.NSURL('alloc')('initFileURLWithPath', string));
	});

	pasteboard('writeObjects', filesToCopy);
};