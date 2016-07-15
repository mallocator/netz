var Factory = require('./Factory');
var Service = require('./Service');

/**
 * A listening service such as rep, sub, pull, respondent
 */
class Receiver extends Service {
  /**
   *
   * @param {Node} node
   * @param {String} name
   * @param {constructor[]} accepts
   * @param {Number} [port]
   */
  constructor(node, name, accepts, port = Factory.port) {
    super(node, name);
    this._accepts = accepts;
    this._port = port;
  }

  /**
   * Returns true if this receiver can interact with the given type of transmitter.
   * @param {Service} sender
   * @returns {boolean}
   */
  accepts(sender) {
    if (!super.accepts(sender)) {
      return false;
    }
    for (let type of this._accepts) {
      if (sender instanceof type) {
        return true;
      }
    }
    return false;
  }

  /**
   * returns the port
   * @returns {Number|*}
   */
  get port() {
    return this._port;
  }

  /**
   * Returns the host on which this service instance runs.
   * @returns {string}
   */
  get host() {
    return this.node.host;
  }
}

module.exports = Receiver;
