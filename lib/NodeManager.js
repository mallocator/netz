var _ = require('lodash');

var Node = require('./Node');


/**
 * The node manager is a central location to look up nodes.
 */
class NodeManager {
  /**
   * @param {Context} context
   */
  constructor(context) {
    this._self = new Node(context, context.listen.substr(0, context.listen.lastIndexOf(':')));
    this._nodes = {};
    // TODO react to nodeAdded/Removed/Changed and update the information we have.
  }

  /**
   * Returns the local node.
   */
  get self() {
    return this._self;
  }

  /**
   * Adds one or more nodes to the list of known nodes.
   * @param {Node|Node[]} nodes
   */
  add(nodes) {
    nodes = _.isArray(nodes) ? nodes : [nodes];
    for (let node of nodes) {
      this._nodes[node.id] = node;
    }
  }

  /**
   * Returns the node with the given id.
   * @param {String} id
   * @returns {Node}
   */
  get(id) {
    return this._nodes[id];
  }

  /**
   * Removes a node from the list of known nodes.
   * @param {String|Node} node
   */
  remove(node) {
    delete this._nodes[node instanceof Node ? node.id : node];
  }

  /**
   * Returns a list with all known nodes.
   * @returns {Node[]}
   */
  get list() {
    let list = [];
    for (let prop in this._nodes) {
      list.push(this._nodes[prop]);
    }
    return list;
  }

  /**
   * Returns a map with all known nodes mapped by id.
   * @returns {Object.<String, Node>}
   */
  get map() {
    return this._nodes;
  }
}

module.exports = NodeManager;
