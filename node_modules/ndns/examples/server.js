var ndns = require ('./lib/ndns');
var util = require ('util');
var sys = require ('sys');
var inspect = sys.inspect, debug = console.error;

function listener (req, res)
{
	res.addRR (ndns.ns_s.ar, 'node.js', ndns.ns_t.txt, ndns.ns_c.in, 1991, 'http://nodejs.org/');
	res.send ();
}

var server = ndns.createServer ('udp4');
server.bind ('5353', '0.0.0.0');
server.on ('request', listener)

