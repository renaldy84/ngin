var path = require('path'),
	net = require('net');
	
var arguments = process.argv.splice(2);
var directory = arguments[0];
var port = arguments[1];

if(!path.existsSync(directory)) {
	console.log('       Directory ' + directory + ' doesn\'t exist!');
	process.exit(1);
}	

console.log('       Process pid=' + process.pid);

var listener = net.Server.prototype.listen;

net.Server.prototype.listen = function(p, host) {
	return listener.apply(this, [port, '0.0.0.0']);
}

require(directory);
