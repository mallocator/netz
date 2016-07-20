var Transmitter = require('../Transmitter');

class Pub extends Transmitter {
  constructor(context, node, name) {
    super(context, node, name);
  }
}

module.exports = Pub;
