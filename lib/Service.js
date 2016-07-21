var EventEmitter = require('eventemitter2');

var nano = require('nanomsg');


/**
 * @typedef {Object} ServiceParams
 * @property {Context} context
 * @property {Node} node
 * @property {String} name
 * @property {String} [type] If no type is set, the class name will be used instead. This option allows to use this class
 *                           for remote services at the same time as local services.
 */

/**
 * A general service class that holds basic information about the service and is subclassed by either listener, sender
 * or hybrid.
 *
 */
class Service extends EventEmitter {
  /**
   *
   * @param {ServiceParams} params
   */
  constructor(params) {
    super({ newListener: false });
    this._context = params.context;
    this._node = params.node;
    this._name = params.name;
    this._type = params.type;
    if (!params.type) {
      this._socket = nano.socket(this.type.toLowerCase(), { encoding: 'utf8' });
      this._socket.on('data', this._receive.bind(this));
    }
  }

  /**
   * Returns the name of this service
   * @returns {String}
   */
  get name() {
    return this._name;
  }

  /**
   * Returns the node this service belongs to
   * @returns {Node}
   */
  get node() {
    return this._node;
  }

  /**
   * Returns the type of service
   * @returns {String}
   */
  get type() {
    return this._type || this.constructor.name;
  }

  /**
   * Returns the socket on which to operate.
   * @returns {*}
   */
  get socket() {
    return this._socket;
  }

  /**
   * Returns the connection string that can be used by nanomsg.
   */
  get address() {
    if (!this.port) {
      throw new Error('Trying to get address of a transmitter');
    }
    return this.node.host + ':' + this.port;
  }

  /**
   * Returns true if the other service can interact with this service. At service level this check verifies that
   * both services use the same service name. Inheriting classes should check for further properties.
   * @param {Service} service
   * @returns {boolean}
   */
  accepts(service) {
    return service.name == this._name;
  }

  /**
   * Send a message to any connected listeners.
   * @param message
   */
  send(message) {
    this.socket.send(new Buffer(JSON.stringify(message), 'utf8'));
  }

  _receive(buffer) {
    if (this.listeners('message').length) {
      this.emit('message', JSON.parse(buffer.toString('utf8')));
    }
  }
}

module.exports = Service;
