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

        it('responds with 500', function(done) {
            const net = require('net');

            const health = new Howru({
                type: 'tcp',
                port: 6999
            });

            health.start();
            health.died();

            const client = net.createConnection({port: 6999}, () => {
                client.write('oke?');
            });

            client.on('data', (data) => {
                assert.equal(parseInt(data, 10), 500);
                health.stop();
                done();
            });
        });

    });

    describe('ttl', function() {

        it('receives a 200 responds within ttl', function(done) {

            const ttl = 1000;
            const startTime = Date.now();

            const server = http.createServer(function(req, res) {
                res.end();
            });
            server.on('request', function(req, res) {
                console.log('receiving');
                assert.ok(Date.now() - startTime < ttl);
                health.stop();
                server.close();
                done();
            });
            server.listen(7000, 'localhost')

                const health = new Howru({
                    type: 'ttl',
                    port: 7000,
                    interval: 100
                });

            health.start();
        });
    });

});

describe('Multiple checks', function() {

    describe('HTTP', function() {

        it('5 good healths in a row', function(done) {

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
                health.stop();
                done();
            });

        });
    });

    describe('TCP', function() {

        it('5 good healths in a row', function(done) {

            const health = new Howru({
                type: 'tcp',
                port: 6999
            });
            let counter = 0;

            health.start();

            const client = net.connect({port: 6999}, () => {
                async.timesSeries(5, (n, next) => {
                    client.write('oke?');
                    setTimeout(next, 1);
                })
            });

            client.on('data', (data) => {
                counter++;
                if (counter == 5) {
                    assert.ok(true);
                    health.stop();
                    done();
                }
            });

            client.on('end', () => console.log('ended'));

        });
    });

    describe('ttl', function() {

        it('5 good healths in a row', function(done) {

            const ttl = 1000;
            const startTime = Date.now();

            const health = new Howru({
                type: 'ttl',
                port: 7000,
                interval: 100
            });

            health.start();
            let counter = 0;

            const server = http.createServer(function(req, res) {
                //res.end();
            });

            server.on('request', function(req, res) {
                req.on('data', (chunk) => {
                    counter++;
                    assert.ok(Date.now() - startTime < ttl);
                    if (counter == 5) {
                        health.stop();
                        server.close();
                        done();
                    }
                });
            });
            server.listen(7000)

        });
    });
});
