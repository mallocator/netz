var Factory = require('../Factory');

/**
 * This method really doesn't do much other than return the list it was given.
 */
exports.discover = () => {
  Factory.emitter.emit('discovered', Factory.options.discovery.hosts);
};
