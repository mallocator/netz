var dgram = require('dgram');

var Discovery = require('.').Discovery;


class BroadcastDiscovery extends Discovery {
  /**
   * Creates a UPD service that listens for incoming messages and at the same time broadcasts messages out until we have
   * managed to find a cluster.
   */
  discover() {
    this._context.on('connected', this.stop.bind(this));
    this._context.on('disconnected', this._start.bind(this));
    if (!this._socket) {
      this._socket = dgram.createSocket("udp4");
      this._socket.on('message', (msg, remote) => {
        msg = msg.toString('utf8');
        if (msg != this._context.listen) {
          this._context.emit('discovered', msg);
        }
        var message = new Buffer(this._context.listen, 'utf8');
        this._socket.setBroadcast(false);
        this._socket.send(message, 0, message.length, remote.port, remote.address, err => {
          if (err) {
            throw new Error(err);
          }
        });
      });
      this._socket.bind(this._context.discovery.port, this._context.discovery.address, this._start.bind(this));
    } else {
      this._start();
    }
  }

  _start() {
    var message = new Buffer(this._context.listen, 'utf8');
    var port = this._context.discovery.sendPort || this._context.discovery.port;
    this._socket.ref();
    this._interval = setInterval(() => {
      this._socket.setBroadcast(true);
      this._socket.send(message, 0, message.length, port, this._context.discovery.broadcast, err => {
        if (err) {
          throw new Error(err);
        }
      });
    }, this._context.discovery.interval);
  }

  /**
   * Stops the broadcast sender, but the listener will still run.
   */
  stop() {
    clearInterval(this._interval);
    this._socket.setBroadcast(false);
    this._socket.unref();
    Factory.removeListener('connected', this.stop.bind(this));
    Factory.removeListener('disconnected', this._start.bind(this));
  }
}

module.exports = BroadcastDiscovery;
