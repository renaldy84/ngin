var ndns = require ('./ndns');
var util = require ('util');
var sys = require ('sys');
var inspect = sys.inspect, debug = console.error;

var HOST = '0.0.0.0', PORT = '5353';

module.exports = function(server, options) {
  var server = ndns.createServer ('udp4');
  server.bind ('5353', '0.0.0.0');
  debug ('listening on ' + HOST + ':' + PORT);
  server.on ('request', function(req, res) {
  	res.addRR(ndns.ns_s.ar, 'node.js', ndns.ns_t.txt, ndns.ns_c.in, 1991, 'http://nodejs.org/');
  	res.addRR(ndns.ns_s.ar, 'node.js', ndns.ns_t.cname, ndns.ns_c.in, 1991, 'nodejs.org');
  	console.log(res);
  	res.send();
  });
}