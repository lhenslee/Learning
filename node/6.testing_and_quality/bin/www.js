#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('nadia:server');
var http = require('http');

/**
 * Get port and store in Express.
 */

var port = 3000;
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app)
  .listen(port, onListening);

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
