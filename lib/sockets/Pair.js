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
    if (others.length) {
      this.socket.connect(others[0].address);
    } else {
      this.socket.bind(this.node.host + ':' + this.port);
    }
  }

  _onServiceRemoved(service) {
    // TODO handle case when the listening service disconnects.
  }
}

module.exports = Pair;
