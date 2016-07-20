var Receiver = require('./Receiver');
var Service = require('./Service');
var Transceiver = require('./Transceiver');


/**
 * A sending service such as req, pub, push and survey.
 */
class Transmitter extends Service {
  /**
   * @param {Context} context
   * @param {Node} node
   * @param {String} name
   * @param {String} type
   */
  constructor(context, node, name, type) {
    super(context, node, name);
    context.on('serviceAdded', this._onServiceAdded.bind(this));
  }

  /**
   *
   * @param {Service} service
   * @private
   */
  _onServiceAdded(service) {
    if (this.accepts(service)) {
      if (service instanceof Receiver || service instanceof Transceiver) {
        this.socket.connect(service.address);
        console.log('connected to', service.address);
      }
    }
  }
}

module.exports = Transmitter;

