var path = require("path");
var projectVersion = require(path.join(__dirname, "package.json")).version + ".alpha";

module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		"clean" : {
		 	"dist-win32": {
				src: ['./../sulu-dist-win32/*', '!./../sulu-dist-win32/.git'],
				options: { force: true }
		 	}
		},
		copy: {
			"dist-win32": {
				files: [
					{
						expand: true,
						cwd: "dist/win32",
						src: [ "**/*", "!**/resources/app/node_modules/**", "!**/resources/default_app/**" ],
						dest: "./../sulu-dist-win32/",
						flatten: false
					},
					{
						expand: true,
						cwd: "./",
						src: [ "dist-readme.txt", "LICENSE.md", ".gitignore" ],
						dest: "./../sulu-dist-win32",
						flatten: false
					}
				]
			}
		},
		rename: {
		  "dist-win32": {
		    files: [
		        {
	        		src : ['./../sulu-dist-win32/dist-readme.txt'], 
	        		dest: './../sulu-dist-win32/README.md'
	        	},
			]
		  }
		},
		bump: {
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
		shell: {
			"checkout-branch-dist-win32": {
				options: {
					failOnError:false
				},
				command: [
					"cd " + path.join(__dirname, ".."),
					"git clone https://github.com/s-a/sulu-dist-win32.git",
					"cd " + path.join(__dirname, "..", "sulu-dist-win32"),
					"git checkout --orphan gh-pages"
				].join(" && ")
			},
			"commitFiles-dist-win32": {
				options: {
					failOnError:false
				},
				command: [
					"cd " + path.join(__dirname, "..", "sulu-dist-win32"),
					"git add .",
					"git commit -m " + (projectVersion||"test") + "",
					"git tag v" + projectVersion + " -m \"version " + projectVersion + "\"",
				].join(" && ")
			},
			"pushFiles-dist-win32": {
				options: {
					failOnError:false
				},
				command: [
					"cd " + path.join(__dirname, "..", "sulu-dist-win32"),
					"git push origin gh-pages",
					"git push tags origin gh-pages"
				].join(" && ")
			}
		},
	});

	// Build Deployment
	require('load-grunt-tasks')(grunt);

	grunt.registerTask('deploy:win32', [
		'shell:checkout-branch-dist-win32',
		'clean:dist-win32',
		'copy:dist-win32',
		'rename:dist-win32',
		'shell:commitFiles-dist-win32',
		'shell:pushFiles-dist-win32'
	]);
};