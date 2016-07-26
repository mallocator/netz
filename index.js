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
   *
   * @param {String} type
   * @returns {Req}
   */
  req(type) {
    return this._context._services.create('Req', type);
  }

  /**
   *
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
   * A helper method that will create service based on your communication requirements. This method should help for
   * anyone who isn't too sure about which service connect to which.
   * @param {String} type       The type of the service you want to create (aka it's name, e.g. "myService")
   * @param {Boolean} one2many  Set to true if you want a service that talks with all connected nodes instead of just
   *                            one out of the cluster
   * @param {Boolean} responds  Set to true if you want the receiver to be able to send responses to the transmitter
   * @param {Boolean} receiver  Set to true if you want to receive message with this service otherwise you will get the
   *                            sender service.
   */
  service(type, one2many, responds, receiver) {
    if (one2many) {
      if (responds) {
        return receiver ? this.respondent(type) : this.surveyor(type);
      } else {
        return receiver ? this.sub(type) : this.pub(type);
      }
    } else {
      if (responds) {
        return receiver ? this.rep(type) : this.req(type);
      } else {
        return receiver ? this.pull(type) : this.push(type);
      }
    }
  }

  /**
   * Stops all operations and will disconnect from the cluster. Local services may still work though.
   */
  shutdown() {
    // TODO clean up existing services and unregister them from the cluster before closing down.
    this._discovery.stop();
    this._context._cluster.stop();
  }
}

module.exports = Netz;
