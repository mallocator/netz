var Stream = require('stream');
var nano = require('nanomsg');

/**
 * A general service class that holds basic information about the service and is subclassed by either listener, sender
 * or hybrid.
 *
 */
class Service extends Stream.Duplex {
  /**
   *
   * @param node
   * @param {String} name
   * @param {String} [type]
   */
  constructor(node, name, type) {
    super({ newListener: false });
    this._node = node;
    this._name = name;
    this._type = type;
    if (!type) {
      this._socket = nano.socket(this.type.toLowerCase());
      this._socket.on('data', buffer => this.emit('message', buffer.toString('utf8')))
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
   * Returns true if the other service can interact with this service.
   * @param {Service} service
   * @returns {boolean}
   */
  accepts(service) {
    return service.name == this._name;
  }

  /**
   * Send a message to any connected listeners.
   * @param message
   * @param encoding
   */
  send(message, encoding = 'utf8') {
    console.log('sending')
    this.socket.send(new Buffer(message, encoding));
  }

  _write(chunk, encoding= 'utf8', cb) {
    // TODO implement to support stream writing
  }

  _read(size) {
    // TODO implement to support stream reading
  }
}

module.exports = Service;

var Factory = require('./Factory');
