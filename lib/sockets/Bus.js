var Transceiver = require('../Transceiver');


class Bus extends Transceiver {
  /**
   * @param {Context} context
   * @param {Node} node
   * @param {String} name
   * @param {Number} [port]
   */
  constructor(context, node, name, port) {
    super(context, node, name, [Bus], port);
  }
}

module.exports = Bus;