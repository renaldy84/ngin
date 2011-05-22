var Logger = module.exports = function(server) {

  server.on('start', function(version) {
    console.log('=> Booting ngin@' + version);
    console.log('pid=' + process.pid + ', gid=' + process.getgid() + ', uid=' + process.getuid());
    console.log('cwd=' + process.cwd());
    console.log('node ' + process.version);
    console.log('Ctrl-C to shutdown server');
  })
  
  server.on('app_started', function(app) {
    console.log('started on 0.0.0.0:' + app.port + ', pid=' + app.process.pid);
  })
  
  server.on('app_error', function(app, error) {
    console.log(error);
  })
  
  server.on('app_exit', function(app, code) {
    console.log('Application ' + app.package.name + ' terminated with exit code=' + code);
  })
}