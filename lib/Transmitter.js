var Service = require('./Service');

/**
 * A sending service such as req, pub, push and survey.
 */
class Transmitter extends Service {
  /**
   * @param {Node} node
   * @param {String} name
   * @param {String} type
   */
  constructor(node, name, type) {
    super(node, name);
  }

  /**
   * Send a message to any connected listeners.
   * @param message
   * @param encoding
   */
  send(message, encoding = 'utf8') {

  }
}

module.exports = Transmitter;
