var Receiver = require('./Receiver');
var Transmitter = require('./Transmitter');

/**
 * A listening service such as rep, sub, pull, respondent
 */
class Transceiver extends Receiver {
  /**
   * @param {Context} context
   * @param {Node} node
   * @param {String} name
   * @param {Number} port
   */
  constructor(context, node, name, port) {
    super(context, node, name);
    super.__proto__ = new Transmitter(context, node, name);
    this._port = port;
  }

  /**
   * Returns true if this receiver can interact with the given type of transmitter.
   * @param {Service} sender
   * @returns {boolean}
   */
  accepts(sender) {
    return super.accepts(sender) && sender instanceof this.constructor;
  }

  /**
   * returns the port
   * @returns {Number}
   */
  get port() {
    return this._port;
  }

  /**
   * Returns the host on which this service instance runs.
   * @returns {String}
   */
  get host() {
    return this.node.host;
  }

  /**
   * Send a message to any connected listeners.
   * @param message
   * @param encoding
   */
  send(message, encoding = 'utf8') {

  }
}

module.exports = Receiver;
