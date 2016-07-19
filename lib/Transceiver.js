var Factory = require('./Factory');
var Service = require('./Service');

/**
 * A listening service such as rep, sub, pull, respondent
 */
class Receiver extends Service {
  /**
   * @param {Node} node
   * @param {String} name
   * @param {Number} [port]
   */
  constructor(node, name, port = Factory.services.port) {
    super(node, name);
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
