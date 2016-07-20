var _ = require('lodash');


class ServiceManager {
  /**
   * Options
   * @param context
   */
  constructor(context) {
    this._context = context;
    this._ports = {}; // TODO this is just a temporary placeholder to make this work
    this._sockets = {
      Req: {},
      Rep: {}
    }
  }

  /**
   *
   * @param socket
   * @param type
   * @returns {Service}
   */
  create(socket, type) {
    socket = _.capitalize(socket);
    if (this._sockets[socket][type]) {
      return this._sockets[socket][type];
    }
    let node = this._context._nodes.self;
    let instance;
    try {
      instance = this._sockets[socket][type] = new (require('./sockets/' + socket))(this._context, node, type, this.port);
    } catch (e) {
      console.log(e);
      throw new Error('The socket type "' + socket + '" has not yet been implemented.');
    }
    instance.listen && instance.listen();
    this._context.emit('serviceAdded', instance);
    this._sockets[socket][type] = instance;
    return instance;
  }

  /**
   * Returns a random available port.
   */
  get port() {
    // TODO check if a port is available for this service type (multiple types can be on same address:port as long as they don't conflict)
    var ports = this._context.ports;
    var range = ports.max - ports.min + 1;
    while(range > Object.keys(this._ports)) {
      var port = _.random(ports.min, ports.max);
      if (!this._ports[port]) {
        return port;
      }
    }
    throw Error('The number of ports available have been exhausted!');
  }
}

module.exports = ServiceManager;
