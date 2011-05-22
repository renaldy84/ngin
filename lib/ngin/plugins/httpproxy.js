var http = require('http');

module.exports = function(server) {
  var self = this;
  
  self.apps = [];
  
  server.on('app_started', function(app) {
    self.apps.push(app);
  });
  
  server.on('start', function() {
    http.createServer(function(request, response) {
      
      console.log(require('sys').inspect(request));
      
      var options = {
        host: '127.0.0.1',
        port: 3002,
        path: request.path,
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

    }).listen(8080);
  });
}