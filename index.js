const http = require('http');

module.exports = function(options) {

  if (options.type == 'http') {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end();
    });

    server.listen(options.port || 6999);
  }

}
