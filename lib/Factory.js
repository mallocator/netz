var EventEmitter = require('eventemitter2');


class Factory extends EventEmitter {
  constructor() {
    super({ newListener: false} );
  }

  /**
   * Sets the global options object and at the same time initializes the dependent services.
   * @param {Options} options
   */
  set options(options) {
    if (options instanceof Options) {
      this._options = options;
    } else {
      this._options = new Options(options);
    }
    this.services = new ServiceManager();
    this.nodes = new NodeManager();
    this._discovery = new DiscoveryManager(this);
  }

  /**
   * Returns the global options object.
   * @returns {Options}
   */
  get options() {
    return this._options;
  }

  /**
   * return the discovery manager.
   * @returns {DiscoveryManager}
   */
  get discovery() {
    return this._discovery;
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
    super.removeAllListeners();
    this._discovery && this._discovery.stop();
    delete this._options;
    this._ports = {};
  }
}

module.exports = new Factory();

var DiscoveryManager = require('./discovery');
var NodeManager = require('./NodeManager');
var Options = require('./Options');
var Receiver = require('./Receiver');
var ServiceManager = require('./ServiceManager');
var Transceiver = require('./Transceiver');
var Transmitter = require('./Transmitter');
