var path    = require('path'),
    fs      = require('fs'),
    npm     = require('npm'),
    spawn   = require('child_process').spawn,
    Application = require('../application');

var Npm = module.exports = function(server) {

  var prepare = Application.prototype.prepare;
  
  Application.prototype.prepare = function() {
    var self = this;

    var npm = spawn(process.execPath, [
      path.join(__dirname, 'npm_installer.js'), path.join(self.directory, 'package.json')], { 
        cwd: self.directory,
        env: process.env,
        customFds: [-1, -1, -1],
        setsid: false
      });

    npm.on('exit', function(code) {
      if(code != 0) {
        self.emit('error', 'Error while installing application dependancies!');
      }

      prepare.apply(self);
    })
  }
}