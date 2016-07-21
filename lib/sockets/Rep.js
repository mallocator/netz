var Receiver = require('../Receiver');
var Req = require('./Req');


class Rep extends Receiver {
  /**
   *
   * @param {Context} context
   * @param {Node} node
   * @param {String} name
   * @param {Number} port
   */
  constructor(context, node, name, port) {
    super({ context, node, name, accepts: [Req], port});
  }
}

module.exports = Rep;
