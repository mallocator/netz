var _ = require('lodash');

var Receiver = require('../Receiver');
var Pub = require('./Pub');


class Sub extends Receiver {
  /**
   * @param {Context} context
   * @param {Node} node
   * @param {String} name
   * @param {Number} port
   */
  constructor(context, node, name, port) {
    super({ context, node, name, accepts: [Pub], port });
  }

  /**
   * Subscribe to one or more topics. Subscribing to topics remove this subscriber from the global channel.
   * @param {String|String[]} topics
   */
  subscribe(topics) {
    if (!topics || ! topics.trim().length) {
      throw new Error('A topic is required to subscribe to');
    }
    topics = _.isArray(topics) ? topics : [topics];
    this.socket.chan(topics);
  }

  /**
   * Unsubscribe from one or more topics.
   * @param {String|String[]} topics
   */
  unsubscribe(topics) {
    if (!topics || ! topics.trim().length) {
      throw new Error('A topic is required to unsubscribe from');
    }
    topics = _.isArray(topics) ? topics : [topics];
    this.socket.rmchan(...topics);
  }

  /**
   * Send is not implemented on a sub socket.
   * @throws Error
   */
  send() {
    throw new Error('Send is not supported on pull service');
  }

  /**
   * Overwrites the default _receive method because pub messages can be prefixed with a topic.
   * @param {Buffer} buffer
   * @private
   */
  _receive(buffer) {
    if (this.listeners('message').length) {
      let message = buffer.toString('utf8');
      let topic = message.substr(0, message.indexOf(' '));
      let payload = JSON.parse(message.substr(topic.length + 1));
      this.emit('message', payload, topic);
    }
  }
}

module.exports = Sub;
