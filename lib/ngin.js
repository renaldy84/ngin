var	sys 	= require('sys'),
	path 	= require('path'),
	Spawner = require('./ngin/spawner');

var spawner = new Spawner(path.join(__dirname, 'config.json'));
spawner.bootstrap('test');
spawner.bootstrap('test2');