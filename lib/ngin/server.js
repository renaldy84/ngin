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
	
	self.appsPath = options.appsPath || '.';
	self.port = options.port || 3000;
	
	self.appsToStart = [];
	
	self.package = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf8'));	

	console.log('-----> Booting ' + self.package.name + '@'+ self.package.version);	
	console.log('       pid=' + process.pid + ', gid=' + process.getgid() + ', uid=' + process.getuid());
	console.log('       cwd=' + process.cwd());
	console.log('       node ' + process.version);
	console.log('       Ctrl-C to shutdown server');
	
	self.apps = [];
	self.nextPort = 3001;
	
  self.nvm = new Nvm();
}

Server.prototype.start = function() {
  var self = this;
  
  self.nvm.on('load', function() {
    self.nvm.install('0.3.0');
    self.startApps();
  })
  
  self.nvm.load();
}

Server.prototype.startApps = function() {
	var self = this;
	
	console.log('-----> Starting applications ...');
	
	if(!path.existsSync(self.appsPath))
		throw new Error('Applications path ' + self.appsPath + ' doesn\'t exist!');
	
	var apps = fs.readdirSync(self.appsPath);
	
	for(var i in apps) {

		// Create and store application.		
		var app = new App(path.join(self.appsPath, apps[i]), self.nextPort++);
		
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