/*
 * Module dependencies.
 */
var exec = require('child_process').exec,
	path = require('path'),
	fs = require('fs');

/*
 * Initialize node.js versions management component.
 *
 * @param {bin} Path to nvm bin.
 * @param {dir} Path to the directory which contains all the installed node binaries.
 */
var Nvm = module.exports = function(bin, dir) {
	var self = this;
	
	console.log('-----> Detecting installed node.js versions.');
	
	self.bin = bin;
	self.dir = dir || '/Users/petr/.nvm/';
	
	self.installed = {};
	
	var ls = exec('ls ' + self.dir,
		function (error, stdout, stderr) {
			var vers = stdout.split('\n');
		
			for(var i in vers) {
				var node = path.join(self.dir, vers[i], 'bin', 'node');
				if(path.existsSync(node)) {
					console.log('       ' + node);
					self.installed[vers[i]] = node;
				}
			}
		
			console.log('       Done.');
		});
}