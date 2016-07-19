var Service = require('./Service');


/**
 * A sending service such as req, pub, push and survey.
 */
class Transmitter extends Service {
  /**
   * @param {Node} node
   * @param {String} name
   * @param {String} type
   */
  constructor(node, name, type) {
    super(node, name);
    Factory.on('serviceAdded', this._onServiceAdded.bind(this));
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

var Factory = require('./Factory');
var Receiver = require('./Receiver');
var Transceiver = require('./Transceiver');
