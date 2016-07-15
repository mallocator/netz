class Node {
  constructor(host, services = {}) {
    this._host = host;
    this._services = services;
  }

  get host() {
    return this._host;
  }

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
}

module.exports = Node;
