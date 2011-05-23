var http = require('http');

module.exports = function(server, options) {
  var self = this;

  self.apps = [];
  self.port = options.port || 80;
  self.domains = options.domains || {};
  
  server.on('app_started', function(app) {
    self.apps.push(app);
  });
  
  server.on('start', function() {
    http.createServer(function(request, response) {

      var port = 80;
      var app = self.domains[request.headers.host.split(':').shift()];
      
      if(!app) {
        console.log('App for ' + request.headers.host + ' not found!');
        return;
      }
      
      console.log(app);
      
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