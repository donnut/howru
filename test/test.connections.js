const assert = require('assert');
const async = require('async');
const http = require('http');
const net = require('net');
const Howru = require('..');

describe('Connections', function() {

  describe('HTTP', function() {

    it('reject premature connection', function(done) {

      const health = new Howru({
        type: 'http',
        route: '/health'
      });

      var req = http.request({path: '/health', port: 6999, method: 'POST'}, (res) => {});
      req.on('error', (err) => {
        assert.equal(err.code, 'ECONNREFUSED');
        done();
      });

    });

    xit('ignore unknown url route', function(done) {

      const health = new Howru({
        type: 'http',
        route: '/health'
      });

      health.start();

      var req = http.request({path: '/fail', port: 6999, method: 'POST'}, (res) => {
        health.stop();
        done();
      });

    });

    it('responds with 200', function(done) {

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

  describe('tcp', function() {

    it('responds with 200', function(done) {
      const net = require('net');

      const health = new Howru({
        type: 'tcp',
        port: 6999
      });

      health.start();

      const client = net.createConnection({port: 6999}, () => {
        client.write('oke?');
      });

      client.on('data', (data) => {
        assert.equal(parseInt(data, 10), 200);
        health.stop();
        done();
      });
    });

  });
});

describe('Multiple checks', function() {

  describe('HTTP', function() {

    it('5 good healths in a row', function(done) {
      const http = require('http');

      const health = new Howru({
        type: 'http',
        route: '/health',
        port: 6999
      });

      health.start();

      async.times(5, function(n, next) {
        var req = http.request({path: '/health', port: 6999, method: 'POST'}, (res) => {
          next(null, res.statusCode)
        });
        req.write(' ');
      }, function(err, result) {
        assert.equal(result.length, 5);
        assert.deepEqual(result, [200,200,200,200,200]);
        done();
      });

    });
  });
});
