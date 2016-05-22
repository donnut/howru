const http = require('http');
const net = require('net');

module.exports = (function() {

  function Howru(options) {
    this.type = options.type || 'http';
    if (this.type == 'http') {
      this.route = options.route || '/health';
      this.port = options.port || 6999;
    } else if (this.type == 'tcp') {
      this.port = options.port || 6999;
    }
    this.status = 200;
    this.server = null;
  }

  Howru.prototype.status = function() {
    return this.status;
  }

  Howru.prototype.stop = function() {
    if (this.type == 'http') {
      this.server.close();
    } else if (this.type == 'tcp') {
      this.server.close();
    }
  }

  Howru.prototype.died = function() {
    this.status = 500;
  }

  Howru.prototype.start = function() {

    if (this.type == 'http') {
      this.server = http.createServer((req, res) => {
        if (req.url == this.route) {
          res.writeHead(this.status, {'Content-Type': 'text/plain'});
          res.end();
        }
      });

    } else if (this.type == 'tcp') {
      this.server = net.createServer()
      this.server.on('connection', (sock) => {
        sock.on('end', () => {});
        sock.on('data', (data) => {
          sock.write(String(this.status));
        })
      });
    } else {
      throw new Error('not implemented yet');
      // push health status
    }

    this.server.listen(this.port);

  }

  return Howru;

}());
