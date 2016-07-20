var Node = require('./Node');


class NodeManager {
  /**
   * @param {Context} context
   */
  constructor(context) {
    this._self = new Node(context, context.listen.substr(0, context.listen.lastIndexOf(':')));
  }

  /**
   * Returns the local node.
   */
  get self() {
    return this._self;
  }
}

module.exports = NodeManager;
