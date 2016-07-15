var fs = require('fs');
var path = require('path');

var Factory = require('./lib/Factory');

class Netz {
  constructor(options) {
    Factory.options = options;
    this._discover();
  }

  _discover() {
    let files = fs.readdirSync(path.join(__dirname, '/lib', '/discovery'));
    for (let file of files) {
      let fileType = path.basename(file, path.extname(file));
      if (fileType == Factory.options.discovery.type) {
        let discovery = require(path.join(__dirname, '/lib', '/discovery', file));
        return discovery.discover(this.options, this);
      }
    }
    throw new Error('Unable to find discovery method of type ' + this.options.discovery.type);
  }
}

module.exports = Netz;
