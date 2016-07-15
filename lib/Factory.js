var _ = require('lodash');
var EventEmitter = require('eventemitter2');

var Options = require('./Options');


class Factory {
  constructor() {
    this._ports = {};
    this._emitter = new EventEmitter();
    this._emitter.on('serviceAdded', service => {
      this.ports[service.port] = service;
    });
    this.services = new ServiceManager(this._emitter);
    this.nodes = new NodeManager(this._emitter);
  }

  /**
   * Sets the global options object.
   * @param {Options} options
   */
  set options(options) {
    if (options instanceof Options) {
      this._options = options;
    } else {
      this._options = new Options(options);
    }
  }

  /**
   * Returns the global options object.
   * @returns {Options}
   */
  get options() {
    return this._options;
  }

  /**
   * Returns the global event emitter.
   * @returns {EventEmitter}
   */
  get emitter() {
    return this._emitter;
  }

  /**
   * Returns a random available port.
   */
  get port() {
    var ports = this.options.ports;
    var range = ports.max - ports.min + 1;
    while(range > Object.keys(this._ports)) {
      var port = _.random(ports.min, ports.max);
      if (!this._ports[port]) {
        return port;
      }
    }
    throw Error('The number of ports available have been exhausted!');
  }

  /**
   * A global debug method.
   */
  debug(...args) {
    if (this._options.debug) {
      this._options.debug.call(null, args)
    }
  }

  /**
   * Resets the factory to it's initial state.
   */
  reset() {
    module.exports = new Factory();
    this.emitter.removeAllListeners();
  }
}

class ServiceManager {
  constructor(emitter) {

  }
}

class NodeManager {
  constructor(emitter) {

  }
}

module.exports = new Factory();
