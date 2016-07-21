var Receiver = require('./Receiver');
var Service = require('./Service');
var Transceiver = require('./Transceiver');


/**
 * A sending service such as req, pub, push and survey.
 */
class Transmitter extends Service {
  /**
   * @param {ServiceParams} params
   */
  constructor(params) {
    super(params);
    params.context.on('serviceAdded', this._onServiceAdded.bind(this));
  }

  /**
   *
   * @param {Service} service
   * @private
   */
  _onServiceAdded(service) {
    if (this.accepts(service)) {
      if (service instanceof Receiver) {
        this.socket.connect(service.address);
      }
    }
  }
}

module.exports = Transmitter;

