var Receiver = require('../Receiver');

class Res extends Receiver {
  constructor(node, name, port) {
    super(node, name, [Req], port);
  }
}

module.exports = Res;
