var Discovery = require('.').Discovery;


class UnicastDiscovery extends Discovery {
  /**
   * This method really doesn't do much other than return the list it was given.
   */
  discover() {
    this._context.emit('discovered', this._context.discovery.hosts);
  }
}

module.exports = UnicastDiscovery;
