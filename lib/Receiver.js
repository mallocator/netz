var Service = require('./Service');


/**
 * @typedef {Object} ReceiverParams
 * @augments ServiceParams
 * @property {constructor[]} accepts
 * @property {Number} port
 */

/**
 * A listening service such as rep, sub, pull, respondent
 */
class Receiver extends Service {
  /**
   *
   * @param {ReceiverParams} params
   */
  constructor(params) {
    super(params);
    this._accepts = params.accepts;
    this._port = params.port;
  }

  /**
   * Will start listening for incoming connections.
   */
  listen() {
    this.socket.bind(this.node.host + ':' + this.port);
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
}

module.exports = Receiver;
