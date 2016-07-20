var Receiver = require('../Receiver');
var Surveyor = require('./Surveyor');


class Respondent extends Receiver {
  constructor(context, node, name, port) {
    super(context, node, name, [Surveyor], port);
  }
}

module.exports = Respondent;
