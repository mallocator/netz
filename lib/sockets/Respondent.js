var Receiver = require('../Receiver');
var Surveyor = require('./Surveyor');


class Respondent extends Receiver {
  constructor(context, node, name, port) {
    super({ context, node, name, accepts: [Surveyor], port });
  }
}

module.exports = Respondent;
