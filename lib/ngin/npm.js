var npm = require('npm'),
    fs = require('fs');

var arguments = process.argv.splice(2);
var package = JSON.parse(fs.readFileSync(arguments[0], 'utf8'));
var dependencies = package.dependencies;

// Check if all application dependencies are satisfied.
npm.load({loglevel: 'warn'}, function (error) {

  if (error) {
    console.log('Cannot load npm to install dependencies');
    process.exit(1);
  } 
  else {
    // Read in and parse dependencies file.
    var count = 0;

    // Npm package installation callback.
    afterInstall = function() {
      count--;
      if(!count) {
        console.log('Successfully installed application dependencies.');
        process.exit(0);
      }
    }

    // Count how many packages we need to install.
    for(var i in dependencies) {
      count++;
    }

    if(count == 0) {
      process.exit(0);
      return;
    }

    console.log('Installing ' + count + ' package(s) and their dependencies...');

    // Install each package listed as dependancy in package.json file.
    for(var i in dependencies) {
      console.log(i + "@" + dependencies[i] + " ./node_modules/" + i);
      npm.commands.install([i], afterInstall);
    }
  }
});