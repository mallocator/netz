var fs = require('fs');
var path = require('path');


class DiscoveryManager {
  /**
   * @param {Context} context
   */
  constructor(context) {
    this._context = context;
  }

  /**
   * Starts a discovery.
   */
  start() {
    let files = fs.readdirSync(path.join(__dirname));
    for (let file of files) {
      let fileType = path.basename(file, path.extname(file));
      if (fileType == this._context.discovery.type) {
        let Method = require(path.join(__dirname, file));
        if (Method.prototype instanceof DiscoveryManager.Discovery) {
          this._discovery = new Method(this._context);
          return this._discovery.discover();
        }
      }
    }
    throw new Error('Unable to find discovery method of type ' + this._context.discovery.type);
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
   * @param {Context} context
   */
  constructor(context) {
    this._context = context;
  }

  /**
   * @abstract
   */
  discover() {
    throw new Error('Discovery not implemented!');
  }

  stop() {}
};

module.exports = DiscoveryManager;
