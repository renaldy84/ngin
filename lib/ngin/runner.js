/*
 * Runner - system component responsible to encapsulate spawning of new app.
 */

/*
 * Module dependencies.
 */
var path = require('path'),
	net = require('net');
	
var arguments = process.argv.splice(2);
var directory = arguments[0];
var port = arguments[1];

var listener = net.Server.prototype.listen;

net.Server.prototype.listen = function(p, host) {
	return listener.apply(this, [port, '0.0.0.0']);
}

require(directory);
