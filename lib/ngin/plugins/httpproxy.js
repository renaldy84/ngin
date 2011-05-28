var http = require('http'),
    fs = require('fs'),
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
module.exports = function(server, options) {
  var self = this;

  // List of applications running on server.
  self.apps = [];
  
  self.logger = new Log(options.level, fs.createWriteStream('access.log', {flags: 'a'}));
  
  // Port which is used by proxy.
  self.port = options.port || 80;
  
  // List of domain rules.
  self.domains = options.domains || {};
  
  server.on('app_started', function(app) {
    self.apps.push(app);
  });
  
  server.on('start', function() {
    http.createServer(function(request, response) {

      self.logger.info(request.method + ' ' + request.headers.host + request.url);

      var port = 80;
      var app = self.domains[request.headers.host.split(':').shift()];
      
      // Throw error in case there was no app found.
      if(!app) {
        throw new Error('App for ' + request.headers.host + ' not found!');
        return;
      }
      
      for(var i in self.apps) {
        if(self.apps[i].package.name == app) {
          port = self.apps[i].port;
        }
      }
      
      var options = {
        host: '127.0.0.1',
        port: port,
        path: request.url,
        method: request.method,
        headers: request.headers
      };
      
      var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        
        res.on('data', function (chunk) {
          response.write(chunk);
        });
        
        res.on('end', function() {
          response.end();
        })
      });

      // write data to request body
      //req.write(request.data);
      req.end();

    }).listen(self.port);
  });
}