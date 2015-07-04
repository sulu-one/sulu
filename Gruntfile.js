var path = require("path");
var projectVersion = "";

module.exports = function(grunt) {
	grunt.registerTask('fetchProjectVersion', 'Determining package.json.version', function(/*arg1, arg2*/) {
	  	projectVersion = require("./package.json").version;
    	grunt.log.writeln(projectVersion);
	});


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
		gitadd: {
	   		"dist-win32": {
	     		options: {
		        	cwd: "./../sulu-dist-win32",
	     		},
	     		files: {
       				src: ['.']
     			}
   			}
	 	},
		gitcommit: {
		    "dist-win32": {
		      	options: {
		        	cwd: path.join(__dirname, "..", "sulu-dist-win32"),
		        	message : projectVersion,
		        	force:true
		      	},
		      	files: [
		        	{
		          		src: ["."],
		          		expand: true,
		          		cwd: "./../sulu-dist-win32"
	        		}
		      	]
		    }
	  	},
	});


	// Production Build Tools
	require('load-grunt-tasks')(grunt);
	grunt.registerTask('deploy:win32', [
		'clean:dist-win32',
		'copy:dist-win32',
		'rename:dist-win32',
		'gitadd:dist-win32',
		'fetchProjectVersion',
		'gitcommit:dist-win32',
	]);

	//grunt.registerTask('environment', [/*'npm-install', 'bower',  */'bower_postinst', /*'shell:mongo-service-install',*/'default']);
};