var Service = require('./Service');

class Node {
  /**
   * @param {Context} context
   * @param {String} host
   * @param {Object.<String, Service>} [services={}]
   * @param {Number} [connections=0]
   */
  constructor(context, host, services = {}, connections = 0) {
    this._host = host;
    this._services = services;
    this._connections = connections;
    context.on('serviceAdded', this._onServiceAdded.bind(this));
    context.on('serviceRemoved', this._onServiceRemoved.bind(this));
  }

  /**
   * Returns a unique id, which is equivalent to the host the node runs on.
   * @returns {String}
   */
  get id() {
    return this._host;
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
   * Returns the number of connections to other nodes this node has.
   * @returns {Number}
   */
  get connections() {
    return this._connections;
  }

  /**
   * Set the number of connections this node is connected to.
   * @param {Number} val
   */
  set connections(val) {
    this._connections = val;
  }

  /**
   * Sets the address on which the bus for this node is listening.
   * @param {String} address
   */
  set bus(address) {
    this._bus = address;
  }

  /**
   * Returns the address of the bus on which this node can be reached
   * @returns {String}
   */
  get bus() {
    return this._bus;
  }

  /**
   * Returns the node as a json document.
   */
  get json() {
    return {
      host: this._host,
      bus: this._bus,
      cons: this._connections,
      svc: this._services.map(service => service.json)
    }
  }

  /**
   * Returns a node instance from a given json document.
   * @param json
     */
  static parse(context, json) {
    let services = json.svc.map(service => Service.parse(context, service));
    return new Node(context, json.host, services, json.connections);
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
