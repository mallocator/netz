var Transceiver = require('../Transceiver');


class Bus extends Transceiver {
  /**
   * @param {Context} context
   * @param {Node} node
   * @param {String} name
   * @param {Number} port
   */
  constructor(context, node, name, port) {
    super({ context, node, name, accepts: [Bus], port });
    this._connections = {
      [node.host + ':' + port]: true
    };
    context.on('serviceAdded', this._onServiceAdded.bind(this));
    context.on('serviceRemoved', this._onServiceRemoved.bind(this));
  }

  /**
   * This method will bind to a local host and connect to all known services (that are not this service).
   */
  listen() {
    let others = this._context._services.get(this.name, this.type).filter(entry => {
      return entry.address == this.address;
    });
    if (others.length) {
      for (let node of others) {
        this.socket.connect(node.address);
      }
    }
    this.socket.bind(this.node.host + ':' + this.port);
  }

  /**
   * @param {Service} service
   * @private
   */
  _onServiceAdded(service) {
    if (this.accepts(service) && !this._connections[service.address]) {
      this.socket.connect(service.address);
      this._connections[service.address] = true;
    }
  }

  /**
   * @param service
   * @private
   */
  _onServiceRemoved(service) {
    if (this.accepts(service)) {
      delete this._connections[service.address];
    }
  }
}

module.exports = Bus;
