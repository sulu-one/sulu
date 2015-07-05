var path = require("path");
var projectVersion = require(path.join(__dirname, "package.json")).version;
var platforms = ["win32", "win64", "linux32", "linux64", "osx64"];

var TaskObject = function(taskNamePrefix) {
	this.jobs = {};

	for (var i = 0; i < platforms.length; i++) {
		var os = platforms[i];
		this.jobs[taskNamePrefix + os] = "";
	}

	return this;
};

TaskObject.prototype.eachOS = function(eachItemHandler) {
	for (var os in this.jobs) {
		if (this.jobs.hasOwnProperty(os)){
			eachItemHandler(os);
		}
	}
};

var Task = function() {
	return this;
};

Task.prototype.clean = function() {
	var task =  new TaskObject("dist-");

	task.eachOS(function(taskName) {
		task.jobs[taskName] = {
			src: ["./../sulu-" + taskName + "/*", "!./../sulu-" + taskName + "/.git"],
			options: { force: true }
		}
	});

	return task.jobs;
};

Task.prototype.copy = function() {
	var task =  new TaskObject("dist-");

	task.eachOS(function(taskName) {
		var os = taskName.split("-")[1];
		task.jobs[taskName] = {
			files: [
				{
					expand: true,
					cwd: "dist/" + os,
					src: [
						"**/*",
						"!**/resources/app/node_modules/**",
						"!**/resources/default_app/**",
						"!LICENSE"
					],
					dest: "./../sulu-" + taskName + "/",
					flatten: false
				},
				{
					expand: true,
					cwd: "./",
					src: [ "dist-readme.txt", "LICENSE.md", ".gitignore" ],
					dest: "./../sulu-" + taskName,
					flatten: false
				}
			]
		}
	});

	return task.jobs;
};

Task.prototype.rename = function() {
	var task =  new TaskObject("dist-");

	task.eachOS(function(taskName) {
		task.jobs[taskName] = {
			files: [
				{
					src : ["./../sulu-" + taskName + "/dist-readme.txt"],
					dest: "./../sulu-" + taskName + "/README.md"
				},
			]
		}
	});

	return task.jobs;
};

Task.prototype.shell = function() {
	var task =  new TaskObject("dist-");

	task.eachOS(function(taskName) {

		task.jobs[taskName + "_git-checkout"] = {
			options: {
				failOnError:false
			},
			command: [
				"cd " + path.join(__dirname, ".."),
				"git clone https://github.com/s-a/sulu-" + taskName + ".git",
				"cd " + path.join(__dirname, "..", "sulu-" + taskName),
				"git checkout --orphan gh-pages"
			].join(" && ")
		};

		task.jobs[taskName + "_git-commit"] = {
			options: {
				failOnError:false
			},
			command: [
				"cd " + path.join(__dirname, "..", "sulu-" + taskName),
				"git add . --all",
				"git commit -m " + (projectVersion||"test"),
				"git tag v" + projectVersion + " -m \"version " + projectVersion + "\"",
			].join(" && ")
		};

		task.jobs[taskName + "_git-push" ] = {
			options: {
				failOnError:false
			},
			command: [
				"cd " + path.join(__dirname, "..", "sulu-" + taskName + ""),
				"git push origin gh-pages",
				"git push --tags origin gh-pages"
			].join(" && ")
		};

	});

	return task.jobs;
};


var task = new Task();



module.exports = function(grunt) {


	grunt.initConfig({
		"pkg"		: grunt.file.readJSON('package.json'),
		"clean"  	: task.clean(),
		"copy"	 	: task.copy(),
		"rename"	: task.rename(),
		"shell"		: task.shell(),
		bump		: {
			options: {
				files: ['package.json', './app/package.json'],
				updateConfigs: [],
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json', './app/package.json'], // '-a' for all files
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false,
				pushTo: '',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
			}
		},
	});

	// Build Deployment
	require("load-grunt-tasks")(grunt);


	for (var i = 0; i < platforms.length; i++) {
		var os = platforms[i];
		grunt.registerTask("deploy:" + os, [
			"shell:dist-" + os + "_git-checkout",
			"clean:dist-" + os,
			"copy:dist-" + os,
			"rename:dist-" + os,
			"shell:dist-" + os + "_git-commit",
			"shell:dist-" + os + "_git-push"
		]);
	}
};