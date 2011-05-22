/*
 * Module dependencies.
 */

var net     = require('net'),
    path    = require('path'),
    fs      = require('fs'),
    sys     = require('sys'),
    events  = require('events'),
    Nvm     = require('./nvm'),
    App     = require('./application');

/**
 * Start a new `Server`.
 *
 * Options:
 *
 *   - `port`  Port where server will be running.
 *
 * Events:
 *
 *  start - Dispatched when server start process begins.
 *  kill - When a signal is being sent to all apps.
 *  app_started - Application is started.
 *  app_error - Application had encountered error while starting.
 *  app_exit - Application process has ended.
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

  self.apps = [];
  self.nextPort = 3001;

  self.nvm = new Nvm();
}

sys.inherits(Server, events.EventEmitter);

Server.prototype.start = function() {
  var self = this;
  
  self.emit('start', self.package.version);
  
  self.nvm.on('load', function() {
    self.startApps();
  })
  
  self.nvm.load();
}

Server.prototype.startApps = function() {
  var self = this;

  console.log('Starting applications ...');

  if(!path.existsSync(self.appsPath))
    throw new Error('Applications path ' + self.appsPath + ' doesn\'t exist!');

  self.appsToStart = fs.readdirSync(self.appsPath);
  self.startApp(self.appsToStart.pop());
}

/*
 * Start specified application on the server.
 *
 * @param {String} Application name.
 */
Server.prototype.startApp = function(name) {
  var self = this;
  
  if(!name)
    return;
  
  var app = new App(path.join(self.appsPath, name), self.nextPort++);
  
  app.on('start', function(app) {
    self.emit('app_started', app);
    self.apps.push(app);
    self.startApp(self.appsToStart.pop());
  });

  app.on('error', function(error) {
    self.emit('app_error', app, error);
    self.startApp(self.appsToStart.pop());
  });
  
  app.on('exit', function(code) {
    self.emit('app_exit', app, code);
  })

  console.log('=> Starting app ' + name);
  app.start();
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

/**
 * Use the given `plugin`.
 *
 * @param {Function} plugin
 * @return {Master} for chaining
 * @api public
 */

Server.prototype.use = function(plugin){
  plugin(this);
  return this;
};