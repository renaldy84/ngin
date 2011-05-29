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
  options.level = options.level || Log.INFO;
  
  self.logger = new Log(options.level, fs.createWriteStream('server.log', {flags: 'a'}));

  function log(level, msg) {
    switch(level) {
      case 'info': 
        self.logger.info(msg);
        break;

      case 'notice': 
        self.logger.notice(msg);
        break;

      case 'error':
        self.logger.error(msg);
        break;
    };

    console.log("%s %s", level, msg);
  }
  
  // Server started.
  server.on('start', function(version) {
    log('info', '');
    log('info', '=> Booting ngin@' + version);
    log('info', 'pid=' + process.pid + ', gid=' + process.getgid() + ', uid=' + process.getuid());
    log('info', 'cwd=' + process.cwd());
    log('info', 'node ' + process.version);
    log('info', 'Ctrl-C to shutdown server');
  })
  
  server.on('close', function(code) {
    log('notice', '=> Closing ngin');    
  });
  
  server.on('kill', function(sig) {
    log('notice', 'Server killed with signal ' + sig);
  })
  
  // App start.
  server.on('app_started', function(app) {
    log('notice', 'started on 0.0.0.0:' + app.port + ', pid=' + app.process.pid);
  })
  
  // App startup error.
  server.on('app_error', function(app, error) {
    log('error', error);
  })
  
  // App terminated.
  server.on('app_exit', function(app, code) {
    log(code == 0 ? 'info' : 'error', 'Application ' + app.package.name + ' terminated with exit code=' + code);
  });
  
  server.on('log', function(level, msg) {
    log(level, msg);
  });
}