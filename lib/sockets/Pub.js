var Transmitter = require('../Transmitter');

class Pub extends Transmitter {
  constructor(context, node, name) {
    super({ context, node, name });
  }

  send(message, topic) {
    this.socket.send(new Buffer(topic + ' ' + JSON.stringify(message), 'utf8'));
  }
}

module.exports = Pub;
