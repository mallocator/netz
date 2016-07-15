var Transceiver = require('../Transceiver');

class Pair extends Transceiver {
  /**
   * @param {Node} node
   * @param {String} name
   * @param {Number} [port]
   */
  constructor(node, name, port) {
    super(node, name, port);
  }
}
