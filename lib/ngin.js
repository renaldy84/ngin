var	sys 	= require('sys'),
	path 	= require('path'),
	Spawner = require('./ngin/spawner');

var spawner = new Spawner(config);
spawner.start();