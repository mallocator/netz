var Transceiver = require('../Transceiver');


class Pair extends Transceiver {
  /**
   * @param {Context} context
   * @param {Node} node
   * @param {String} name
   * @param {Number} [port]
   */
  constructor(context, node, name, port) {
    super({context, node, name, accepts: [Pair], port});
    context.on('serviceRemoved', this._onServiceRemoved.bind(this));
  }

  /**
   * Will start listening if no other service exists yet.
   */
  listen() {
    let others = this._context._services.get(this.name, this.type);
    if (others.length == 1) {
      this.socket.connect(others[0].address);
    } else if (others.length > 1) {
      throw new Error('Pairs can only connect one to one, additional connections are not allowed');
    } else {
      this.socket.bind(this.node.host + ':' + this.port);
      this._listener = true;
    }
  }

  /**
   * @param {Service} service
   * @private
   */
  _onServiceRemoved(service) {
    if (!this._listener) {
      this.socket.bind(this.node.host + ':' + this.port);
      this._listener = true;
    }
  }
}

module.exports = Pair;
