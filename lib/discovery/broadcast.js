'use strict';

var dgram = require('dgram');

var Factory = require('../Factory');


/**
 * The dgram socket used to broadcast and listen.
 * @type {dgram.Socket}
 */
exports.socket = null;

/**
 * The interval reference used to turn off sending messages once we have discovered another node.
 * @type {null}
 */
exports.interval = null;

/**
 * Creates a UPD service that listens for incoming messages and at the same time broadcasts messages out until we have
 * managed to find a cluster.
 */
exports.discover = function() {
  Factory.emitter.on('connected', exports.stop);
  Factory.emitter.on('disconnected', exports.start);
  if (!exports.socket) {
    exports.socket = dgram.createSocket("udp4");
    exports.socket.on('message', (msg, remote) => {
      msg = msg.toString('utf8');
      if (msg != Factory.options.listen) {
        exports.emitter.emit('discovered', msg);
      }
      var message = new Buffer(Factory.options.listen, 'utf8');
      exports.socket.setBroadcast(false);
      exports.socket.send(message, 0, message.length, remote.port, remote.address, err => {
        if (err) {
          throw new Error(err);
        }
      });
    });
    exports.socket.bind(Factory.options.discovery.port, Factory.options.discovery.address, exports.start);
  } else {
    exports.start();
  }
};

exports.start = function() {
  var message = new Buffer(exports.options.listen, 'utf8');
  var port = Factory.options.discovery.sendPort || Factory.options.discovery.port;
  exports.interval = setInterval(() => {
    exports.socket.setBroadcast(true);
    exports.socket.send(message, 0, message.length, port, Factory.options.discovery.broadcast, err => {
      if (err) {
        throw new Error(err);
      }
    });
  }, Factory.options.discovery.interval);
};

/**
 * Stops the broadcast sender, but the listener will still run.
 */
exports.stop = function() {
  clearInterval(exports.interval);
  exports.socket.setBroadcast(false);
  Factory.emitter.removeListener('connected', exports.stop);
  Factory.emitter.removeListener('disconnected', exports.start);
};
