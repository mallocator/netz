var Receiver = require('../Receiver');
var Req = require('./Req');


class Rep extends Receiver {
  constructor(context, node, name, port) {
    super({ context, node, name, accepts: [Req], port});
  }
}

module.exports = Rep;
