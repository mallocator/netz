var Discovery = require('.').Discovery;
var Factory = require('../Factory');


class UnicastDiscovery extends Discovery {
  /**
   * This method really doesn't do much other than return the list it was given.
   */
  discover() {
    Factory.emit('discovered', Factory.options.discovery.hosts);
  }
}

module.exports = UnicastDiscovery;
