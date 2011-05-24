var sys = require('sys');
var ndns = require('../lib/ndns');

var server = ndns.createServer ('udp4');

server.bind (5353);
server.on ('request', function onRequest (req, res) {
	res.header = req.header;
	res.question = req.question;
	res.header.qr = 1;
	res.header.ancount = 1;
	res.header.aa = 1;

	res.addRR ('node.js', ndns.ns_t.txt, ndns.ns_c.in, 1337, 'http://nodejs.org');

	res.send ();
});
