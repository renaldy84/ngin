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

/*
 * Called each time before the application is started. All the necessary tasks to validate that
 * application can be spawned without problems should be done here. The app allows you even to
 * do asynchronous tasks, you just have to make sure the 'ready' event is dispatched once the
 * app is prepared for firing up.
 *
 */
Application.prototype.prepare = function() {
  var self = this;

  // Check if the package.json file exists.
  if(!path.existsSync(path.join(self.directory, 'package.json'))) {
    self.emit('error', self.directory + ' is not valid. Please create package.json using npm init.');
    return;
  }
  
  // Try to parse package.json.
  try {
    self.package = JSON.parse(fs.readFileSync(path.join(self.directory, 'package.json'), 'utf8'));  
  }
  catch(e) {
    self.emit('error', e);
  }

  // Check if the main application script exists.
  if(!path.existsSync(path.join(self.directory, self.package.main))) {
    self.emit('error', 'File ' + path.join(self.directory, self.package.main) + ' doesn\'t exist!');
    return;
  }
  
  self.emit('ready');
}

Application.prototype.spawn = function() {
  var self = this;

  self.process = spawn(process.execPath, [
    path.join(__dirname, 'runner.js'), path.join(self.directory, self.package.main), self.port], 
    { 
      cwd: self.directory,
      env: process.env,
      customFds: [0,0,0],
      setsid: false
    }
  );

  self.process.on('exit', function (code) {
    self.emit('exit', code);
  });

  self.emit('start', self);
}