var Transceiver = require('../Transceiver');


class Pair extends Transceiver {
  /**
   * @param {Context} context
   * @param {Node} node
   * @param {String} name
   * @param {Number} [port]
   */
  constructor(context, node, name, port) {
    super(context, node, name, [Pair], port);
  }
}

module.exports = Pair;
