var net		= require('net'),
	path	= require('path'),
	fs		= require('fs'),
	sys		= require('sys'),
	Nvm     = require('./nvm'),
	App		= require('./application');

/**
 * Start a new `Server`.
 *
 * Options:
 *
 *   - `port`  Port where server will be running.
 *
 * Events:
 *
 *   - `kill`. When a `signal` is being sent to all apps.
 *                
 * Signals:
 *
 *   - `SIGINT`   hard shutdown
 *   - `SIGTERM`  hard shutdown
 *   - `SIGQUIT`  graceful shutdown
 *   - `SIGUSR2`  graceful restart
 *
 * @param {Object} Optional params.
 * @return {Server}
 * @api public
 */
var Server = module.exports = function(options) {
	var self = this;
	
	options = options || {};
	
	self.port = options.port || 3000;
	
	self.package = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf8'));	

	console.log('-----> Booting ' + self.package.name + '@'+ self.package.version);	
	console.log('       pid=' + process.pid + ', gid=' + process.getgid() + ', uid=' + process.getuid());
	console.log('       cwd=' + process.cwd());
	console.log('       node ' + process.version);
	console.log('       Ctrl-C to shutdown server');
	
	self.apps = [];
	self.nextPort = 3001;
	
	new Nvm();
}

Server.prototype.startApps = function(appsPath) {
	var self = this;
	
	if(!path.existsSync(appsPath))
		throw new Error('Applications path ' + appsPath + ' doesn\'t exist!');
	
	var apps = fs.readdirSync(appsPath);
	
	for(var i in apps) {

		if(!path.existsSync(path.join(appsPath, apps[i], 'package.json'))) {
			console.log(path.join(appsPath, apps[i]) + ' is not valid node.js application. Please create package.json using npm init.');
			continue;
		}
			
		// Create and store application.		
		var app = new App(path.join(appsPath, apps[i]), self.nextPort++);
		
		app.on('start', function(app) {
			console.log('-----> ' + app.name + ' started on 0.0.0.0:' + app.port + ', pid=' + app.process.pid);
			self.apps.push(app);
		});
		
		app.start();
	}
}

/**
 * Send `sig` to all app processes, defaults to __SIGTERM__.
 *
 * @param {String} sig
 * @api public
 */
Server.prototype.kill = function(sig) {
	var self = this;
	self.emit('kill', sig);
	
	for(var i in self.apps) {
		self.apps[i].stop(sig);
	}
}