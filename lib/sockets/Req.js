var Transmitter = require('../Transmitter');

class Req extends Transmitter {
  constructor(context, node, name) {
    super({ context, node, name });
  }
}

module.exports = Req;
