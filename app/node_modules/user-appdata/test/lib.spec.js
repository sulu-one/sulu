"use strict";

var fs = require("fs");
var path = require("path");
require("should");
var UserAppData; 

try {
	UserAppData = require("./../lib-cov/index.js");
} catch(e){
	UserAppData = require("./../lib/index.js");
}

var defaultSettings = { foo: "bar" };
var appname = "mocha-test-client_" + new Date().getTime()  //random app name

describe("UserAppData.uninstall", function(){
	it("should not exist a config file", function() {
		var config = new UserAppData({appname: appname});
		config.uninstall();
		fs.existsSync(config.filename).should.be.false;
	});
});

describe("UserAppData.init without filename", function(){
	it("should exist a config file", function() {
		var config = new UserAppData({appname: appname, defaultSettings: defaultSettings});
		fs.existsSync(config.filename).should.be.true;
		path.basename(config.filename).should.equal("config.json");
		config.settings.should.deepEqual(defaultSettings);
	});
});

describe("UserAppData.init with filename", function(){
	it("should exist a config file named test-config.json", function() {
		var config = new UserAppData({appname: appname, "filename": "test-config.json", defaultSettings: defaultSettings});
		fs.existsSync(config.filename).should.be.true;
		path.basename(config.filename).should.equal("test-config.json");
		config.settings.should.deepEqual(defaultSettings);
	});
});

describe("UserAppData.init with existing filename", function(){
	it("should exist a config file named test-config.json", function() {
		var config = new UserAppData({appname: appname, "filename": "test-config.json"});
		fs.existsSync(config.filename).should.be.true;
		path.basename(config.filename).should.equal("test-config.json");
		config.settings.should.deepEqual(defaultSettings);
	});
});

describe("UserAppData.init without config", function(){
	it("should throw init exception", function() {
		it("should throw exception when an invalid time value was passed", function(){
			(function() {
				/* jshint ignore:start */
				var config = new UserAppData();
				/* jshint ignore:end */
			}).should.throw("missing appname");
		});
	});
});

describe("UserAppData.save && UserAppData.load", function(){
	it("should save", function() {
		var config = new UserAppData({appname: appname, "filename": "test-config.json"});
		config.settings.bar = "unicorn";
		config.save();
		config.settings.bar.should.equal("unicorn");
	});

	it("should load", function() {
		var config2 = new UserAppData({appname: appname, "filename": "test-config.json"});
		config2.settings.bar.should.equal("unicorn");
	});
});

describe("UserAppData.uninstall after", function(){
	it("should be unstinalled", function() {
		var config = new UserAppData({appname: appname});
		var config2 = new UserAppData({appname: appname, "filename": "test-config.json"});
		config.uninstall()
		config2.uninstall()
		fs.existsSync(config.filename).should.be.false;	
		fs.existsSync(config2.filename).should.be.false;	
	});
});
