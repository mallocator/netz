var Factory = require('./Factory');
var Node = require('./Node');


class NodeManager {
  constructor() {
    this._self = new Node(Factory.options.listen.substr(0, Factory.options.listen.lastIndexOf(':')));
  }

  /**
   * Returns the local node.
   */
  get self() {
    return this._self;
  }
}

module.exports = NodeManager;
