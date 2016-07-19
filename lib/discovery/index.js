var fs = require('fs');
var path = require('path');

var Factory = require('../Factory');


class DiscoveryManager {
  /**
   * Starts a discovery.
   */
  start() {
    let files = fs.readdirSync(path.join(__dirname));
    for (let file of files) {
      let fileType = path.basename(file, path.extname(file));
      if (fileType == Factory.options.discovery.type) {
        let Method = require(path.join(__dirname, file));
        if (Method.prototype instanceof DiscoveryManager.Discovery) {
          this._discovery = new Method();
          return this._discovery.discover();
        }
      }
    }
    throw new Error('Unable to find discovery method of type ' + Factory.options.discovery.type);
  }

  /**
   * Stops a discovery mode from running.
   */
  stop() {
    this._discovery && this._discovery.stop();
  }
}

DiscoveryManager.Discovery = class Discovery {
  /**
   * @abstract
   */
  discover() {
    throw new Error('Discovery not implemented!');
  }

  stop() {}
};

module.exports = DiscoveryManager;
