/*
 * Package dependencies.
 */
var path    = require('path'),
    fs      = require('fs'),
    npm     = require('npm'),
    spawn   = require('child_process').spawn,
    Application = require('../application');

/*
 * Ngin.js NPM dependency installation plugin.
 *
 * Before each application is started the npm installs all the dependencies which are
 * listed in package.json.
 *
 * @param {Server} Server instance.
 */
var Npm = module.exports = function(server) {

  // Store original Application.prepare() method.
  var prepare = Application.prototype.prepare;
  
  // Override prepare method and then call original one.
  Application.prototype.prepare = function() {
    var self = this;

    // Spawn npm_installer process which will take care about installation.
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