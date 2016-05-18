var assert = require('assert');
var howru = require('..');

describe('Connections', function() {

  describe('HTTP', function() {

    it('responds with 200', function(done) {

      var http = require('http');

      var health = howru({
        type: 'http',
        route: '/health'
      });

      var req = http.request({path: '/health', port: 6999, method: 'POST'}, (res) => {
        assert.equal(res.statusCode, 200);
        done();
      });

      req.write('200');
    });
  });
});
