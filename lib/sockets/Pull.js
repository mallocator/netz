var Receiver = require('../Receiver');
var Push = require('./Push');


class Pull extends Receiver {
  constructor(context, node, name, port) {
    super({ context, node, name, accepts: [Push], port });
  }

  send() {
    throw new Error('Send is not supported on pull service');
  }

  _write() {
    throw new Error('Send is not supported on pull service');
  }
}

module.exports = Pull;
