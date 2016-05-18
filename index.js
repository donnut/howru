const http = require('http');

module.exports = (function() {

  function Howru(options) {
    this.type = options.type || 'http';
    if (this.type == 'http') {
      this.route = options.route || '/health';
      this.port = options.port || 6999;
    }
    this.status = 200;
    this.server = null;
  }

  Howru.prototype.status = function() {
    return this.status;
  }

  Howru.prototype.stop = function() {
    this.server.close();
  }

  Howru.prototype.died = function() {
    this.status = 500;
  }

  Howru.prototype.start = function() {

    if (this.type == 'http') {
      this.server = http.createServer((req, res) => {
        res.writeHead(this.status, {'Content-Type': 'text/plain'});
        res.end();
      });

    } else if (this.type == 'tcp') {
      this.server = net.createServer((conn) => {
        conn.on('end', () => {})
      });
    } else {
      // push health status
    }

    this.server.listen(this.port);


  }

  return Howru;

}());
