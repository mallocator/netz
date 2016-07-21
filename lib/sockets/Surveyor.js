var Transmitter = require('../Transmitter');

class Surveyor extends Transmitter {
  constructor(context, node, name) {
    super({ context, node, name });
  }
}

module.exports = Surveyor;
