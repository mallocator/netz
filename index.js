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
    return this._context._services.create('pub', type);
  }

  /**
   *
   * @param {String} type
   * @returns {Sub}
   */
  sub(type) {
    return this._context._services.create('sub', type);
  }

  /**
   *
   * @param {String} type
   * @returns {Push}
   */
  push(type) {
    return this._context._services.create('push', type);
  }

  /**
   *
   * @param {String} type
   * @returns {Pull}
   */
  pull(type) {
    return this._context._services.create('pull', type);
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
   * @param {String} type
   * @returns {Push}
   */
  res(type) {
    return this._context._services.create('rep', type);
  }

  /**
   *
   * @param {String} type
   * @returns {Survey}
   */
  survey(type) {
    return this._context._services.create('surveyor', type);
  }

  /**
   *
   * @param {String} type
   * @returns {Respondent}
   */
  respondent(type) {
    return this._context._services.create('respondent', type);
  }

  pair(type) {
    return this._context._services.create('pair', type);
  }

  /**
   * Stops all operations and will disconnect from the cluster. Local services may still work though.
   */
  shutdown() {
    this._discovery.stop();
  }
}

module.exports = Netz;
