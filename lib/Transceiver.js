var Service = require('./Service');


/**
 * A listening service such as rep, sub, pull, respondent
 */
class Transceiver extends Service {
  /**
   * @param {ReceiverParams} params
   */
  constructor(params) {
    super(params);
    this._accepts = params.accepts;
    this._port = params.port;
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
   * @returns {Number|*}
   */
  get port() {
    return this._port;
  }
}

module.exports = Transceiver;
