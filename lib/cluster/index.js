var nanomsg = require('nanomsg');
var shortId = require('shortid');

var History = require('./history');


class Cluster {
  constructor(context) {
    this._context = context;
    this._history = new History(context);
    this._pair = nanomsg.socket('pair');
    this._pair.on('message', this._onConnecting.bind(this));
    this._bus = nanomsg.socket('bus');
    this._bus.on('message', this._onMessage.bind(this));
    context.on('discovered', this._onDiscovered.bind(this));
    context.on('nodeAdded', this._onNodeAdded.bind(this));
    context.on('nodeRemoved', this._onNodeRemoved.bind(this));
    this._bind(this._pair);
  }

  /**
   * Will bind a given socket to an available port as close as possible to the listen configuration.
   * @param socket
   * @private
   */
  _bind(socket) {
    let address = this._context.listen;
    let i = 0;
    while (i++ < 1000) {
      try {
        socket.bind(address);
        return this._context.debug('Cluster is now listening for incoming nodes at', address);
      } catch (e) {
        if (e.message == 'Address already in use') {
          address = address.replace(/(\d+)$/, (match, number) => parseInt(number) + 1)
        } else {
          throw e;
        }
      }
    }
    throw new Error('Cluster is unable to listen for incoming messages');
  }

  /**
   * Event handler that react to a node being discovered. Once a node has been discovered we send it a list of known
   * nodes on the network.
   * @param {String[]} nodes  A list of node addresses that this node can connect to using nanomsg.
   * @private
     */
  _onDiscovered(nodes) {
    for (let node of nodes) {
      try {
        this._pair.connect(node);
        this._pair.send(new Buffer(JSON.stringify(this._context._nodes.list), 'utf8'));
        this._pair.close();
        return;
      } catch(e) {
        this._context.debug('Unable to connect to node', node);
      }
    }
    this._context.debug('A node was discovered but we were unable to connect to it.');
  }

  /**
   * Event handler for messages on the pairing socket. The buffer contains a list of nodes sent by _onDiscovered().
   * Once the discovery is done this node will close the pair socket and instead open a bus socket to communicate with
   * multiple nodes in the cluster.
   * @param {Buffer} buffer
   * @private
     */
  _onConnecting(buffer) {
    let list = JSON.parse(buffer.toString('utf8'));
    this._context._nodes.add(list);
    this._pair.close();
    list.sort((a,b) => a.connections < b.connections);
    this._bind(this._pair);
    for (let i = 0; i < this._context.cluster.peers; i++) {
      this._bind.connect(list[i].bus);
      // TODO other nodes need to know that they are connected to this node now, so do a broadcast increasing their connection number or find a way to count bus connections
      this._context._nodes.self.connections++;
    }
    this.send('nodeAdded', this._context._nodes.self);
  }

  /**
   * Sends a message to all nodes in the cluster
   * @param {String} event  The event that should be fired on the other nodes
   * @param {*} payload     The payload that should be passed on
     */
  send(event, ...payload) {
    let message = {
      id: shortId.generate(),
      event,
      origin: this._context._nodes.self.id
    };
    switch(event) {
      case 'serviceAdded':
      case 'serviceRemoved':
      case 'nodeAdded':
      case 'nodeChanged':
      case 'nodeRemoved':
        message.payload = payload[0].json;
        break;
      default: throw new Error('Unknown event, will not send to rest of cluster');
    }
    this._bind.send(new Buffer(message, 'utf8'));
  }

  /**
   * TODO Node communication
   * On send
   * - generate message id
   * - send to all connected nodes
   *
   * On receive
   * - check history for message
   * - if no history of message
   * => send message to all other peers
   * - clean history of id after N seconds
   */
  /**
   * The general message handler that receives messages from an established cluster
   * @param {Buffer} buffer
   * @private
   */
  _onMessage(buffer) {
    let message = JSON.parse(buffer.toString('utf8'));
    switch (message.event) {
      case 'serviceAdded':
      case 'serviceRemoved':
      case 'nodeAdded':
      case 'nodeChanged':
      case 'nodeRemoved':
        break;
      default: throw new Error('Unknown event, will not send to rest of cluster')
    }
    this._context.emit(message.event, message.payload);
    // TODO check history and send to other nodes.
  }

  /**
   * Node added handler that will connect to the new node if we don't have as many peer connections as desired yet.
   * @param {Node} node
   * @private
   */
  _onNodeAdded(node) {
    if (this._context._nodes.self.connections < this._context.cluster.peers) {
      this._bind.connect(node.bus);
      this._context._nodes.self.connections++;
    }
  }

  /**
   * If the removed node is one that we are connected to then we need to check if we need to connect to more nodes
   * @param {Node} node
   * @private
   */
  _onNodeRemoved(node) {
    if (this._context._nodes.self.connections < this._context.cluster.peers) {

    }
  }

  /**
   * TODO Node disconnects (might be same node removed)
   * react to node has disconnected involuntarily
   * -> Send other nodeRemoved info to rest of cluster
   * -> if number of connections is < N
   * => Connect to existing node with least connections
   * -> Send own nodeChanged info to rest of cluster
   */

  stop() {
    this._bus && this._bus.close();
  }
}

module.exports = Cluster;
