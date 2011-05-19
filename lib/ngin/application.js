var path	= require('path'),
	fs		= require('fs'),
	spawn	= require('child_process').spawn;

var Application = module.exports = function(directory, port) {
	var self = this;
	console.log(directory);
	
	process.chdir(directory);
	// Load and parse application package.json
	self.package = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));

	self.directory = directory;	
	self.port = port;
	self.version = self.package.version;
	self.process = null;
	self.name = process.cwd().split('/').pop();
	
	console.log('-----> Application ' + self.name);
}

Application.prototype.start = function() {
	var self = this;
	
	if(!path.existsSync(path.join(self.directory, self.package.main))) {
		console.log('       Failed to start app main script! File ' + path.join(self.directory, self.package.main) + ' doesn\'t exist!');
		return;
	}
	
	
	self.process = spawn(process.execPath, [
		path.join(__dirname, 'runner.js'), path.join(self.directory, self.package.main), self.port], 
		{ 
			cwd: process.cwd(),
			env: process.env,
			customFds: [-1, -1, -1],
			setsid: false
		}
	);
	
	console.log('       Started on 0.0.0.0:' + self.port);
	
	self.process.on('exit', function (code) {
	  console.log('       Application ' + self.name + ' terminated with exit code=' + code);
	});
}