var http = require('http'),
    fs = require('fs'),
    events = require('events'),
    sys = require('sys'),
    Proxy = require('./proxy/httpproxy'),
    Log = require('log');

/*
 * Ngin.js HTTP proxy plugin.
 * 
 * Able to proxy requests to server running applications based on the http.request.headers.host
 * and domain settings passed. Atm does support only GET requests.
 *
 * Options
 *  port - Port to start HTTP proxy. Default is 80.
 *  domains - List of the routing rules in format "domain": "appname".
 */
var HTTPProxy = module.exports = function(server, options) {
  var self = this;

  self.logger = new Log(options.level, fs.createWriteStream('access.log', {flags: 'a'}));

  self.rules = options.domains || {};
  
  self.port = options.port || 3000;
  
  // Port which is used by proxy.
  self.proxy = new Proxy();
  
  server.on('app_started', function(app) {
    for(var i in self.rules) {
      if(self.rules[i] == app.package.name) {
        self.proxy.addRule(i, '127.0.0.1:' + app.port);
      }
    }
  });
  
  server.on('start', function() {
    self.logger.info('[proxy] Started');
    self.proxy.listen(self.port);
  });
  
  self.proxy.on('request', function(url) {
    self.logger.info('[proxy] Request ' + url);
  })
}