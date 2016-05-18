# Howru
[![Build Status](https://travis-ci.org/donnut/howru.svg?branch=master)](https://travis-ci.org/donnut/howru)

Health check utility for microservices. Allows a service to inform
the world of its health. Works either with an external pull request (HTTP REST or TCP protocol)
or pushes its health status within a ttl interval.

## Install
```bash
npm install howru --save
```

## Usage
```javascript
var Howru = require('howru');

// http protocol
var health = new Howru({
  type: 'http',
  route: '/health'
});
health.start();

// tcp protocol
var health = new Howru({
  type: 'tcp',
  port: '6999'
});
health.start();

// ttl
var health = new Howru({
  type: 'ttl',
  url: 'consul://',
  interval: 30
});
health.start();
```

## Status
This project is under heavy construction
