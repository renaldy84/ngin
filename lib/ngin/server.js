/*
 * Module dependencies.
 */

var net     = require('net'),
    path    = require('path'),
    fs      = require('fs'),
    sys     = require('sys'),
    events  = require('events'),
    App     = require('./application');

/**
 * Server instance is spawned to handle running of multiple node.js applications.
 * Its responsible to initialize each app, broadcast events between multiple parts of
 * the system or to external modules. Server is designed with plugin system in mind,
 * to be easily extandable the way you want it to.
 *
 * Options:
 *  port - Port where server will be running.
 *  appsPath - Path to the directory in the system, where your apps live.
 *
 * Events:
 *  start - Dispatched when server start process begins.
 *  kill - When a signal is being sent to all apps.
 *  app_started - Application is started.
 *  app_error - Application had encountered error while starting.
 *  app_exit - Application process has ended.
 *                
 * Signals:
 *  SIGINT - Hard shutdown.
 *  SIGTERM - Hard shutdown.
 *  SIGQUIT - Graceful shutdown.
 *  SIGUSR2 - Graceful restart.
 *
 * @param {Object} Optional params.
 * @return {Server}
 * @api public
 */
var Server = module.exports = function(options) {
  var self = this;

  options = options || {};

  self.appsPath = options.appsPath || '.';

  self.appsToStart = [];

  self.package = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf8'));	

  self.apps = [];
  self.nextPort = 3001;
}

sys.inherits(Server, events.EventEmitter);

Server.prototype.start = function() {
  var self = this;
  
  self.emit('start', self.package.version);
  
  self.startApps();
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
  
  app.on('ready', function() {
    app.spawn();
  })

  console.log('=> Starting app ' + name);
  app.prepare();
}

/**
 * Send a signal to all application currently running on the server.
 *
 * @param {String} Signal to be broadcasted.
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
 * Use the given plugin instance, bypass the arguments to its constructor.
 *
 * @param {Function} Plugin to hook into the server.
 * @param {Object} Object containing additional parameters, to be send while
 *                 creating the plugin instance.
 * @return {Server} 
 * @api public
 */
Server.prototype.use = function(plugin, args){
  plugin(this, args);
  return this;
};