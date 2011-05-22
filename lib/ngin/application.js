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

  self.directory = directory;	
  self.port = port;
  self.process = null;
}

sys.inherits(Application, events.EventEmitter);

Application.prototype.prepare = function() {
  var self = this;
  
  var npm = spawn(process.execPath, [
    path.join(__dirname, 'npm.js'), path.join(self.directory, 'package.json')], { 
      cwd: self.directory,
      env: process.env,
      customFds: [0, 0, 0],
      setsid: false
    });
    
  npm.on('exit', function(code) {
    if(code != 1) {
      self.emit('error', 'Error while installing application dependancies!');
    }
    
    self.spawn();
  })

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
  
  if(!path.existsSync(path.join(self.directory, 'package.json'))) {
    self.emit('error', self.directory + ' is not valid node.js application. Please create package.json using npm init.');
    return;
  }
  
  // Load and parse application package.json
  self.package = JSON.parse(fs.readFileSync(path.join(self.directory, 'package.json'), 'utf8'));  
  self.name = self.package.name;

  if(!path.existsSync(path.join(self.directory, self.package.main))) {
    self.emit('error', 'File ' + path.join(self.directory, self.package.main) + ' doesn\'t exist!');
    return;
  }

  self.prepare();
}

Application.prototype.spawn = function() {
  var self = this;

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