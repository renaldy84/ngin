var	sys 	= require('sys'),
	path 	= require('path'),
	Spawner = require('./ngin/spawner');

var config = process.argv[2] || path.join(__dirname, 'config.json');

var spawner = new Spawner(config);
spawner.start();