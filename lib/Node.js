class Node {
  /**
   * @param {Context} context
   * @param {String} host
   * @param {Object.<String, Service>} services
   */
  constructor(context, host, services = {}) {
    this._host = host;
    this._services = services;
    context.on('serviceAdded', this._onServiceAdded.bind(this));
    context.on('serviceRemoved', this._onServiceRemoved.bind(this));

  }

  /**
   * Returns the host of this node (e.g. tcp://127.0.0.1)
   * @returns {String}
     */
  get host() {
    return this._host;
  }

  /**
   * Returns a map of all the services on this node
   * @returns {Object.<String, Service>|*}
   */
  get services() {
    return this._services;
  }

  /**
   * Returns the service with the given name, or undefined if it wasn't found.
   * @param {String} name
   * @returns {Service|undefined}
     */
  find(name) {
    return this._services[name];
  }

  _onServiceAdded(service) {
    if(service.node.host == this.host) {
      this._services[service.name] = service;
    }
  }

  _onServiceRemoved(service) {
    if(service.node.host == this.host) {
      delete this._services[service.name];
    }
  }
}

module.exports = Node;
