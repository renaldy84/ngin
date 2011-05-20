/*
 * Module dependencies.
 */

var path    = require('path'),
    fs      = require('fs'),
    sys     = require('sys'),
    events  = require('events'),
    npm     = require('npm'),
    spawn   = require('child_process').spawn;

/*
 * Application on the server.
 */
var Application = module.exports = function(directory, port) {
	var self = this;

	// Load and parse application package.json
	self.package = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));

	self.directory = directory;	
	self.port = port;
	self.name = self.package.name;
	self.process = null;
}

sys.inherits(Application, events.EventEmitter);

Application.prototype.prepare = function() {
	var self = this;
	
	// Check if all application dependencies are satisfied.
	npm.load({}, function (error) {

		if (error) {
			console.log("       Cannot load npm to install dependencies");
			throw error;
		} 
		else {

			// Read in and parse dependencies file.
			var count = 0;

			// Npm package installation callback.
			afterInstall = function() {
				count--;
				if(!count) {
					console.log("       Successfully installed application dependencies");
					self.spawn();
				}
			}

			// Count how many packages we need to install.
			for(var i in self.package.dependencies) {
				count++;
			}
			
			if(count == 0) {
				self.spawn();
				return;
			}

			console.log("       Installing " + count + " package(s) and their dependencies...");

			// Install each package listed as dependancy in package.json file.
			for(var i in self.package.dependencies) {
				console.log("       " + i + "@" + self.package.dependencies[i] + " ./node_modules/" + i);
				npm.commands.install([i], afterInstall);
			}
		}
	});
	
	
	
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
	
	self.prepare();
}

Application.prototype.spawn = function() {
	var self = this;
	
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