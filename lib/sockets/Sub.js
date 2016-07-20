var _ = require('lodash');

var Receiver = require('../Receiver');
var Pub = require('./Pub');


class Sub extends Receiver {
  constructor(context, node, name, port) {
    super(context, node, name, [Pub], port);
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

  send() {
    throw new Error('Send is not supported on pull service');
  }

  _write() {
    throw new Error('Send is not supported on pull service');
  }
}

module.exports = Sub;
