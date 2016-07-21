var Transmitter = require('../Transmitter');

class Req extends Transmitter {
  /**
   * @param {Context} context
   * @param {Node} node
   * @param {String} name
   */
  constructor(context, node, name) {
    super({ context, node, name });
  }
}

module.exports = Req;
