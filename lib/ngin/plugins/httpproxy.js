var http = require('http');

module.exports = function(server, options) {
  var self = this;

  self.apps = [];
  self.port = options.port || 3000;
  
  server.on('app_started', function(app) {
    self.apps.push(app);
  });
  
  server.on('start', function() {
    http.createServer(function(request, response) {
      var tokens = request.url.split('/');
      var path = '/' + tokens.splice(2).join('/');
      var port = 80;
      
      console.log(request.method + ' ' + path);
      
      for(var i in self.apps) {
        if(self.apps[i].package.name == tokens[1]) {
          port = self.apps[i].port;
        }
      }
      
      var options = {
        host: '127.0.0.1',
        port: port,
        path: path,
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