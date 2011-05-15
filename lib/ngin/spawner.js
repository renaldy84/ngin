var net		= require('net'),
	path	= require('path'),
	sys		= require('sys'),
	App		= require('./application');

var global = {
	directories: {
		apps: '/Users/petr/incubator/ngin/apps'
	},
	portMin: 3000 // Minimal number of port assigned to app started on the server.
};

var Spawner = module.exports = function() {
	var self = this;
	
	self.apps = {};
	self.nextPort = global.portMin;
}

/*
 * Bootstrap the specified application. 
 *
 * @param	{String}	Name of the application to be started.
 */
Spawner.prototype.bootstrap = function(app) {
	var self = this;
	
	// Change process working directory to application path.
	process.chdir(global.directories.apps + '/' + app)
	
	// Create and store application.
	var app = new App(process.cwd(), self.nextPort++);

	self.apps[process.cwd()] = app;
	
	console.log('       Version ' + app.version);
	
	app.start();
}