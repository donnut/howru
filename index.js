const http = require('http');

module.exports = (function() {

  function Howru(options) {
    this.options = options;
    this.status = 200;
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

    if (this.options.type == 'http') {
      this.server = http.createServer((req, res) => {
        res.writeHead(this.status, {'Content-Type': 'text/plain'});
        res.end();
      });

      this.server.listen(this.options.port || 6999);
    }
  }

  return Howru;

}());
