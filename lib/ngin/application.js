/*
 * Module dependencies.
 */

var path	= require('path'),
	fs		= require('fs'),
	sys		= require('sys'),
	events = require('events'),
	spawn	= require('child_process').spawn;

/*
 * Application on the server.
 */
var Application = module.exports = function(directory, port) {
	var self = this;

	// Load and parse application package.json
	self.package = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));

	self.directory = directory;	
	self.port = port;
	self.name = process.cwd().split('/').pop();
	self.process = null;
}

sys.inherits(Application, events.EventEmitter);

Application.prototype.prepare = function() {
	// Check if all application dependencies are satisfied.
	
	// Check if proper node.js version is installed
}

/*
 * Check if application is running.
 */
Application.prototype.isRunning = function() {
	return self.process != null && !self.process.killed;
}

/*
 * Stop the application on the server.
 */
Application.prototype.stop = function(sig) {
	var self = this;
	
	if(!self.isRunning()) {
		return;
	}
	
	self.process.kill(sig);
}

Application.prototype.restart = function() {
	var self = this;
	
	self.stop();
	self.start();
}

Application.prototype.start = function() {
	var self = this;
	
	if(!path.existsSync(path.join(self.directory, self.package.main))) {
		console.log('-----> Failed to start app main script! File ' + path.join(self.directory, self.package.main) + ' doesn\'t exist!');
		return;
	}
	
	process.chdir(self.directory);
	
	self.process = spawn(process.execPath, [
		path.join(__dirname, 'runner.js'), path.join(self.directory, self.package.main), self.port], 
		{ 
			cwd: self.directory,
			env: process.env,
			customFds: [-1, -1, -1],
			setsid: false
		}
	);
	
	self.process.on('exit', function (code) {
	  console.log('Application ' + self.name + ' terminated with exit code=' + code);
	});
	
	self.emit('start', self);
}