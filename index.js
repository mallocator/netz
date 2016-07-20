var DiscoveryManager = require('./lib/discovery');
var Options = require('./lib/Options');


class Netz {
  constructor(options) {
    if (options instanceof Options) {
      this._context = options;
    } else {
      this._context = new Options(options);
    }
    this._discovery = new DiscoveryManager(this._context);
    this._discovery.start();
  }

  /**
   * Returns a service socket of type 'req'. If the socket for the service already exists on this node, that instance is
   * returned otherwise a brand new one is created.
   * @param {String} type
   * @returns {Req}
   */
  req(type) {
    return this._context._services.create('req', type);
  }

  /**
   * Returns a service socket of type 'res'. If the socket for the service already exists on this node, that instance is
   * returned otherwise a brand new one is created.
   * @param {string} type
   * @returns {Rep}
   */
  res(type) {
    return this._context._services.create('rep', type);
  }

  /**
   * Stops all operations and will disconnect from the cluster. Local services may still work though.
   */
  shutdown() {
    this._discovery.stop();
  }
}

module.exports = Netz;
