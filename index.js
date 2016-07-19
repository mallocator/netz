var Factory = require('./lib/Factory');

class Netz {
  constructor(options) {
    Factory.options = options;
    Factory.discovery.start();
  }

  /**
   * Returns a service socket of type 'req'. If the socket for the service already exists on this node, that instance is
   * returned otherwise a brand new one is created.
   * @param {String} type
   * @returns {Req}
   */
  req(type) {
    return Factory.services.create('req', type);
  }

  /**
   * Returns a service socket of type 'res'. If the socket for the service already exists on this node, that instance is
   * returned otherwise a brand new one is created.
   * @param {string} type
   * @returns {Rep}
   */
  res(type) {
    return Factory.services.create('rep', type);
  }
}

module.exports = Netz;
