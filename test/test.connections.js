const assert = require('assert');
const Howru = require('..');

describe('Connections', function() {

  describe('HTTP', function() {

    it('responds with 200', function(done) {

      const http = require('http');

      const health = new Howru({
        type: 'http',
        route: '/health'
      });

      health.start();

      var req = http.request({path: '/health', port: 6999, method: 'POST'}, (res) => {
        assert.equal(res.statusCode, 200);
        health.stop();
        done();
      });

      req.write('200');

    });

    it('responds with 500', function(done) {

      const http = require('http');

      const health = new Howru({
        type: 'http',
        route: '/health'
      });

      health.start();
      health.died();

      var req = http.request({path: '/health', port: 6999, method: 'POST'}, (res) => {
        assert.equal(res.statusCode, 500);
        health.stop();
        done();
      });

      req.write(' ');
    });
  });
});
