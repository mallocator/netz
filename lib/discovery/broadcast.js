var dgram = require('dgram');

var Discovery = require('.').Discovery;
var Factory = require('../Factory');


class BroadcastDiscovery extends Discovery {
  /**
   * Creates a UPD service that listens for incoming messages and at the same time broadcasts messages out until we have
   * managed to find a cluster.
   */
  discover() {
    Factory.emitter.on('connected', this._stop.bind(this));
    Factory.emitter.on('disconnected', this._start.bind(this));
    if (!this._socket) {
      this._socket = dgram.createSocket("udp4");
      this._socket.on('message', (msg, remote) => {
        msg = msg.toString('utf8');
        if (msg != Factory.options.listen) {
          Factory.emitter.emit('discovered', msg);
        }
        var message = new Buffer(Factory.options.listen, 'utf8');
        this._socket.setBroadcast(false);
        this._socket.send(message, 0, message.length, remote.port, remote.address, err => {
          if (err) {
            throw new Error(err);
          }
        });
      });
      this._socket.bind(Factory.options.discovery.port, Factory.options.discovery.address, this._start.bind(this));
    } else {
      this._start();
    }
  }

  _start() {
    var message = new Buffer(Factory.options.listen, 'utf8');
    var port = Factory.options.discovery.sendPort || Factory.options.discovery.port;
    this._socket.ref();
    this._interval = setInterval(() => {
      this._socket.setBroadcast(true);
      this._socket.send(message, 0, message.length, port, Factory.options.discovery.broadcast, err => {
        if (err) {
          throw new Error(err);
        }
      });
    }, Factory.options.discovery.interval);
  }

  /**
   * Stops the broadcast sender, but the listener will still run.
   */
  _stop() {
    clearInterval(this._interval);
    this._socket.setBroadcast(false);
    this._socket.unref();
    Factory.emitter.removeListener('connected', this._stop.bind(this));
    Factory.emitter.removeListener('disconnected', this._start.bind(this));
  }
}

module.exports = BroadcastDiscovery;
