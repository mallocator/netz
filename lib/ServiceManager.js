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
      Rep: {},
      Pub: {},
      Sub: {},
      Push: {},
      Pull: {},
      Pair: {},
      Bus: {},
      Surveyor: {},
      Respondent: {}
    }
  }

  /**
   *
   * @param socket
   * @param type
   * @returns {Service|Push|Pull|Req|Rep|Pub|Sub|Surveyor|Respondent|Pair|Bus}
   */
  create(socket, type) {
    this._sockets[socket][type] = this._sockets[socket][type] || [];
    let node = this._context._nodes.self;
    let instance;
    try {
      instance = new (require('./sockets/' + socket))(this._context, node, type, this.port);
    } catch (e) {
      console.log(e);
      throw new Error('The socket type "' + socket + '" has not yet been implemented.');
    }
    instance.listen && instance.listen();
    this._context.emit('serviceAdded', instance);
    this._sockets[socket][type].push(instance);
    return instance;
  }

  /**
   *
   * @param {String} name The service name given by the user
   * @param {String} type The socket type (e.g. Req, Rep, Pub, Sub, ...)
   * @returns {Service[]} All knows services for this name & type
   */
  get(name, type) {
    return this._sockets[type][name] || [];
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
