/*
 * Module dependencies.
 */
var exec = require('child_process').exec,
	path = require('path'),
	fs = require('fs'),
	sys = require('sys'),
	events = require('events');

/*
 * Initialize node.js versions management component.
 *
 * Events
 * loaded - Dispatched after list of available node.js versions is loaded.
 *
 * @param {bin} Path to nvm bin.
 * @param {dir} Path to the directory which contains all the installed node binaries.
 */
var Nvm = module.exports = function() {}

sys.inherits(Nvm, events.EventEmitter);

Nvm.prototype.load = function(bin, dir) {
  var self = this;

  console.log('-----> Detecting installed node.js versions.');

  self.bin = bin;
  self.dir = dir || '/Users/petr/.nvm/';

  self.installed = {};

  var ls = exec('ls ' + self.dir, function (error, stdout, stderr) {
    var vers = stdout.split('\n');
    for(var i in vers) {
      var node = path.join(self.dir, vers[i], 'bin', 'node');
      if(path.existsSync(node)) {
        self.installed[vers[i]] = node;
      }
    }

    console.log('       Done.');
    self.emit('load');
  });
}

/*
 * Get path to the node binary for specific version.
 *
 * @param {String} Version of required node.js library.
 */
Nvm.prototype.getPath = function(version) {
  var self = this;
  return self.installed['v' + version];
}

Nvm.prototype.install = function(version) {
  var self = this;
  
  console.log('-----> Installing node.js v' + version);
  var install = exec('~/.nvm/nvm.sh install v' + version, function (error, stdout, stderr) {
    console.log(stderr);
    console.log('       Done.');
    self.emit('installed', version);
  });  
}