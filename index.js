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
   *
   * @param {String} type
   * @returns {Pub}
   */
  pub(type) {
    return this._context._services.create('Pub', type);
  }

  /**
   *
   * @param {String} type
   * @returns {Sub}
   */
  sub(type) {
    return this._context._services.create('Sub', type);
  }

  /**
   *
   * @param {String} type
   * @returns {Push}
   */
  push(type) {
    return this._context._services.create('Push', type);
  }

  /**
   *
   * @param {String} type
   * @returns {Pull}
   */
  pull(type) {
    return this._context._services.create('Pull', type);
  }

  /**
   * Returns a service socket of type 'req'. If the socket for the service already exists on this node, that instance is
   * returned otherwise a brand new one is created.
   * @param {String} type
   * @returns {Req}
   */
  req(type) {
    return this._context._services.create('Req', type);
  }

  /**
   * Returns a service socket of type 'res'. If the socket for the service already exists on this node, that instance is
   * returned otherwise a brand new one is created.
   * @param {String} type
   * @returns {Push}
   */
  rep(type) {
    return this._context._services.create('Rep', type);
  }

  /**
   *
   * @param {String} type
   * @returns {Surveyor}
   */
  surveyor(type) {
    return this._context._services.create('Surveyor', type);
  }

  /**
   *
   * @param {String} type
   * @returns {Respondent}
   */
  respondent(type) {
    return this._context._services.create('Respondent', type);
  }

  /**
   *
   * @param {String} type
   * @returns {Pair}
   */
  pair(type) {
    return this._context._services.create('Pair', type);
  }

  /**
   *
   * @param {String} type
   * @returns {Bus}
   */
  bus(type) {
    return this._context._services.create('Bus', type);
  }

  /**
   * Stops all operations and will disconnect from the cluster. Local services may still work though.
   */
  shutdown() {
    this._discovery.stop();
  }
}

module.exports = Netz;
