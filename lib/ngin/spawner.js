var net		= require('net'),
	path	= require('path'),
	fs		= require('fs'),
	sys		= require('sys'),
	App		= require('./application');

var Spawner = module.exports = function(config) {
	var self = this;
	
	self.apps = {};
	self.config = JSON.parse(fs.readFileSync(config, 'utf8'));
	self.nextPort = self.config.portMin;
	
	console.log('-----> Spawner started.');
	
}

/*
 * Bootstrap the specified application. 
 *
 * @param	{String}	Name of the application to be started.
 */
Spawner.prototype.bootstrap = function(app) {
	var self = this;
	
	// Change process working directory to application path.
	process.chdir(self.config.directories.apps + '/' + app)
	
	// Create and store application.
	var app = new App(process.cwd(), self.nextPort++);

	self.apps[process.cwd()] = app;
	
	console.log('       Version ' + app.version);
	
	app.start();
}