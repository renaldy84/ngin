var	sys = require('sys'),
	Spawner = require('./ngin/spawner');

var spawner = new Spawner();
spawner.bootstrap('test');
spawner.bootstrap('test2');