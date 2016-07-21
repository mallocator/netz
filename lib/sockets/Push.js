var Transmitter = require('../Transmitter');

class Push extends Transmitter {
  constructor(context, node, name) {
    super({ context, node, name });
  }
}

module.exports = Push;
