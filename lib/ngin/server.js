var net		= require('net'),
	path	= require('path'),
	fs		= require('fs'),
	sys		= require('sys'),
	App		= require('./application');

var Server = module.exports = function(appsPath, options) {
	var self = this;
	
	self.appsPath = appsPath;
	
	options = options || {};
	
	self.port = options.port || 3000;
	self.package = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf8'));	

	console.log('-----> Booting ' + self.package.name + '@'+ self.package.version);	
	console.log('       pid=' + process.pid + ', gid=' + process.getgid() + ', uid=' + process.getuid());
	console.log('       cwd=' + process.cwd());
	console.log('       node ' + process.version);
	console.log('       Ctrl-C to shutdown server');
	
	self.apps = {};
	self.nextPort = 3001;
}

Server.prototype.start = function() {
	var self = this;
	
	if(!path.existsSync(self.appsPath))
		throw new Error('Applications path ' + self.appsPath + ' doesn\'t exist!');
	
	var apps = fs.readdirSync(self.appsPath);
	
	for(var i in apps) {

		if(!path.existsSync(path.join(self.appsPath, apps[i], 'package.json'))) {
			console.log(path.join(self.appsPath, apps[i]) + ' is not valid node.js application. Please create package.json using npm init.');
			continue;
		}
			
		// Create and store application.		
		var app = new App(path.join(self.appsPath, apps[i]), self.nextPort++);
		self.apps[apps[i]] = app;
		app.start();
	}
}