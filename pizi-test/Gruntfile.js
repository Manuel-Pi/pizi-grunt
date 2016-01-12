module.exports = function(grunt) {
	grunt.initConfig({
		srcFile: 'src/',
		build: 'build/',
		testFile: 'tests/',
		serverFolder: 'C:/Users/e_na/Documents/GitHub/pizi-express-server/Apps/fsdfsf/',
		jshint: {
			all: {
				options: {
					devel: true,
					esnext: true
				},
				src: ''
			}
		},
		copy: {
			deployDev : {
					files : [
						{
							expand: true,
							cwd: '',
							src: ['**'],
							dest: ''
						},
						{
							expand: true,
							cwd: '',
							src: ['**'],
							dest: ''
						}
					]
			},
			deployDevBabel : {
				files : [
					{
						expand: true,
						cwd: '',
						src: ['**'],
						dest: ''
					},
					{
						expand: true,
						cwd: '',
						src: ['**'],
						dest: ''
					},
					{
						expand: true,
						cwd: 'node_modules/',
						src: [
							'backbone/backbone.js',
							'backbone/node_modules/underscore/underscore.js',
							'jquery/dist/jquery.js'
						],
						dest: '',
						flatten: true
					}
				]
			}
		},
		clean: {
			options :{
				force : true
			},
			deployDev: '',
			build: ''
		},
		babel: {
			options: {
				sourceMap: false,
				"experimental": true,
        		"modules": "umd"
			},
			dist: {
				files: [{
					"expand": true,
					"cwd": '',
					"src": ["**/*.js"],
					"dest": '',
					"ext": ".js"
				}]
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-babel');
	
	grunt.registerTask('build', ['jshint', 'clean:build', 'babel']);
	grunt.registerTask('deployDev', ['jshint', 'clean:deployDev', 'copy:deployDev']);
	grunt.registerTask('deployBuild', ['build', 'clean:deployDev', 'copy:deployDevBabel']);
};