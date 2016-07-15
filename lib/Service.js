var EventEmitter = require('eventemitter2');

/**
 * A general service class that holds basic information about the service and is subclassed by either listener, sender
 * or hybrid.
 */
class Service extends EventEmitter {
  constructor(node, name) {
    super({ newListener: false });
    this._node = node;
    this._name = name;
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
   * Returns true if the other service can interact with this service.
   * @param {Service} service
   * @returns {boolean}
   */
  accepts(service) {
    return service.name == this._name;
  }
}

module.exports = Service;
