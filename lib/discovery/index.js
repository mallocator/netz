var fs = require('fs');
var path = require('path');

var Factory = require('../Factory');


exports.run = () => {
  let files = fs.readdirSync(path.join(__dirname));
  for (let file of files) {
    let fileType = path.basename(file, path.extname(file));
    if (fileType == Factory.options.discovery.type) {
      let Discovery = require(path.join(__dirname, file));
      if (Discovery.prototype instanceof exports.Discovery) {
        return new Discovery().discover();
      }
    }
  }
  throw new Error('Unable to find discovery method of type ' + Factory.options.discovery.type);
};

exports.Discovery = class Discovery {
  discover() {
    throw new Error('Discovery not implemented!');
  }
};
