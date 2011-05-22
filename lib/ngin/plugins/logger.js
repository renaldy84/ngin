var Logger = module.exports = function(server) {
  console.log("w00t!!!");
  server.on('start', function(version) {
    console.log('=> Booting ngin@' + version);
    console.log('pid=' + process.pid + ', gid=' + process.getgid() + ', uid=' + process.getuid());
    console.log('cwd=' + process.cwd());
    console.log('node ' + process.version);
    console.log('Ctrl-C to shutdown server');
  })
}