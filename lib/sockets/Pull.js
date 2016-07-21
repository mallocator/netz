var Receiver = require('../Receiver');
var Push = require('./Push');


class Pull extends Receiver {
  /**
   *
   * @param {Context} context
   * @param {Node} node
   * @param {String} name
   * @param {Number} port
   */
  constructor(context, node, name, port) {
    super({ context, node, name, accepts: [Push], port });
  }

  /**
   * Send is not supported for this type of socket.
   * @throws Error
   */
  send() {
    throw new Error('Send is not supported on pull service');
  }
}

module.exports = Pull;
