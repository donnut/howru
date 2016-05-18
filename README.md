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
var howru = require('howru');

// http protocol
var health = howru({
  type: 'http',
  route: '/health'
});

// tcp protocol
var health = howru({
  type: 'tcp',
  port: '6901'
});

// ttl
var health = howru({
  type: 'ttl',
  url: 'consul://',
  interval: 30
});
```

## Status
This project is under heavy construction
