var fs = require('fs');
var path = require('path');

var discovery = require('./lib/discovery');
var Factory = require('./lib/Factory');

class Netz {
  constructor(options) {
    Factory.options = options;
    discovery.run();
  }
}

module.exports = Netz;
