/*
 * Ngin.js Logger plugin.
 *
 * Writes all the important server events to the console output. Able to work in multiple
 * log levels.
 *
 */
 
var fs = require('fs'),
    Log = require('log');
 
var Logger = module.exports = function(server, options) {
  var self = this;
  
  options = options || {};

  self.log = new Log(options.level || Log.INFO, fs.createWriteStream('server.log', {flags: 'a'}));
  
  // Server started.
  server.on('start', function(version) {
    self.log.info('=> Booting ngin@' + version);
    self.log.info('pid=' + process.pid + ', gid=' + process.getgid() + ', uid=' + process.getuid());
    self.log.info('cwd=' + process.cwd());
    self.log.info('node ' + process.version);
    self.log.info('Ctrl-C to shutdown server');
  })
  
  // App start.
  server.on('app_started', function(app) {
    self.log.notice('started on 0.0.0.0:' + app.port + ', pid=' + app.process.pid);
  })
  
  // App startup error.
  server.on('app_error', function(app, error) {
    self.log.error(error);
  })
  
  // App terminated.
  server.on('app_exit', function(app, code) {
    self.log.notice('Application ' + app.package.name + ' terminated with exit code=' + code);
  });
  
  server.on('log', function(level, msg) {
    switch(level) {
      case 'info': 
        self.log.info(msg);
        break;
        
      case 'error':
        self.log.error(msg);
        break;
    };
  })
}