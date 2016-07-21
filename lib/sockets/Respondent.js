var Receiver = require('../Receiver');
var Surveyor = require('./Surveyor');


class Respondent extends Receiver {
  /**
   * @param {String} context
   * @param {Node} node
   * @param {String} name
   * @param {Number} port
   */
  constructor(context, node, name, port) {
    super({ context, node, name, accepts: [Surveyor], port });
  }
}

module.exports = Respondent;
