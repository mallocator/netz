var Receiver = require('../Receiver');
var Req = require('./Req');


class Rep extends Receiver {
  constructor(node, name, port) {
    super(node, name, [Req], port);
  }
}

module.exports = Rep;
