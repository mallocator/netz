var path = require('path');

var _ = require('lodash');
var shortId = require('shortid');


/**
 * Regular expression that checks for a valid ipv4.
 * @type {RegExp}
 */
const ipv4regex = /((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)/;

/**
 * A helper parent that will automatically create getters for all values and call setters if they exist.
 */
class Validator {
  /**
   * @param {Object} opts                 The options object that will be checked by this validator.
   * @param {String|String[]} [required]  A list of required properties on the options object. Guarantees that the
   *                                      validator is called even if there's no value set.
   */
  constructor(opts, ...required) {
    if (this.default) {
      opts = Object.assign(this.default, opts);
    }
    if (!required && this.required) {
      required = this.required;
    }
    for (let prop in opts) {
      _.remove(required, prop);
      if (opts.hasOwnProperty(prop)) {
        let value = this[prop] ? this[prop](opts[prop]) : opts[prop];
        Object.defineProperty(this, prop, {
          get: () => value,
          set: () => { throw new Error('Unable to modify options'); },
          configurable: false,
          enumerable: true
        });
      }
    }
    if (required.length) {
      for (let prop of required) {
        if (_.isFunction(this[prop])) {
          let value = this[prop](opts[prop]);
          if (value === undefined) {
            throw new Error('Invalid configuration, missing required options (' + this.constructor.name + '): ' + required);
          }
          _.remove(required, prop);
          Object.defineProperty(this, prop, {
            get: () => value,
            set: () => {
              throw new Error('Unable to modify options');
            },
            configurable: false,
            enumerable: true
          });
        }
      }
    }
  }
}


/**
 * The global options object. Once it has been created the existing values can no longer be modified.
 * @property {Object} [cluster]                     General cluster configuration
 * @property {string} [cluster.name]                A cluster name if you want to run multiple clusters in parallel
 * @property {string|number} [listen=2206]          Port on which to listen for cluster broadcasts.This can either be a number
 *                                                  which will be used to bind to tcp://0.0.0.0:<port> or the complete host
 *                                                  string.
 * @property {DiscoveryOpts} [discovery]            Discovery options object, properties depend on the type (default=multicast)
 * @property {object} [nodes]                       Configuration options regarding nodes
 * @property {Ports} [ports]                        The port range in which auto generated addresses will be listened on
 */
class Options extends Validator {
  /**
   * @param {String|Options} opts The options object or the location of a json file with the options to be loaded.
   */
  constructor(opts) {
    if (_.isString(opts)) {
      opts = require(path.join(module.main.filename, opts));
    }
    super(opts, 'id', 'cluster', 'ports');
  }

  /**
   * Defaults for the global options object
   */
  get default() {
    return {
      listen: 2206,
      discovery: {
        type: 'broadcast'
      },
      cluster: {
        name: 'default'
      }
    }
  }

  /**
   * Normalizes the id.
   * @param {string} val
   * @returns {string}
     */
  id(val) {
    return _.trim(val || shortId.generate());
  }

  /**
   * Validates port ranges.
   * @param {Object} val
   * @returns {Ports}
   */
  ports(val) {
    return new Ports(val);
  }

  /**
   * Makes sure that the cluster has a name.
   * @param {Object} val
   * @param {String} val.name
   * @returns {Object}
     */
  cluster(val)  {
    if (!val || !val.name) {
      throw new Error('Cluster needs to have a name')
    }
    return val;
  }

  /**
   * @typedef {Object} DiscoveryOpts
   * @property {String} type  The type of discovery that we're dealing with
   */

  /**
   * @param {Object} val
   * @returns {DiscoveryOpts}
   */
  discovery(val) {
    switch(val.type.toLowerCase().trim()) {
      case 'multi':
      case 'multicast':
      case 'broadcast':
        return new BroadcastDiscovery(val);
      case 'aws':
      case 'amazon':
        return new AwsDiscovery(val);
      case 'uni':
      case 'unicast':
        return new UnicastDiscovery(val);
      case 'file':
      case 'local':
        return new LocalDiscovery(val);
      default:
        throw new Error('Unknown discovery method selected');
    }
  }

  /**
   * Will set the debug function to either what was given or to console.log.
   * @param {function|*} val
   * @returns {function}
   */
  debug(val) {
    if (_.isFunction(val)) {
      return val;
    }
    if (val) {
      return console.log;
    }
    return null;
  }
}


/**
 * Validates that port definitions are in expected ranges.
 */
class Ports extends Validator {
  /**
   * returns the default port configuration
   */
  get default() {
    return {
      min: 40000,
      max: 50000
    };
  }

  /**
   * Validates that the maximum port is in a valid range.
   * @param {Number|String} val
   * @returns {Number}
   */
  max(val) {
    val = parseInt(val);
    if (val > 65535) {
      throw new Error('Maximum port value above valid range');
    }
    if (this.min && val < this.min) {
      throw new Error('Maximum port is set below minimum port value');
    }
    return val;
  }

  /**
   * Validates that the minimum port is in a valid range.
   * @param {Number|String} val
   * @returns {Number}
   */
  min(val) {
    val = parseInt(val);
    if (val < 1) {
      throw new Error('Minimum port value below valid range');
    }
    if (this.max && val > this.min) {
      throw new Error('Minimum port is set above maximum port value');
    }
    return val;
  }
}


/**
 * The validator for broadcast discovery.
 * @extends DiscoveryOpts
 * @property {Number} [port=22060]                The port on which to listen for broadcasts
 * @property {String} [address=0.0.0.0]           The adapter address on which to listen for broadcasts
 * @property {Number} [sendPort=22060]            The port on which to send broadcast messages
 * @property {String} [broadcast=255.255.255.255] The address used to broadcast this node information on
 * @property {Number} [interval=1000]             The interval with which messages are sent in ms.
 */
class BroadcastDiscovery extends Validator {
  /**
   * The default options for when you choose to use multicast for discovery.
   * @returns BroadcastDiscovery
   */
  get default() {
    return {
      port: 22060,
      address: '0.0.0.0',
      broadcast: '255.255.255.255',
      interval: 1000
    };
  }

  /**
   * Validates the multicast port.
   * @param val
   * @returns {Number|*}
     */
  port(val) {
    val = parseInt(val);
    if (val < 1) {
      throw new Error('Multicast discovery port value below valid range');
    }
    if (val > 65535) {
      throw new Error('Multicast discovery port value above valid range');
    }
    return val;
  }

  address(val) {
    if (!val.match(ipv4regex)) {
      throw new Error('The given multicast host is not a valid ipv4:', val);
    }
    return val;
  }

  /**
   * Validates the broadcasting mask.
   * @param {String} val
   */
  broadcast(val) {
    if (!val.match(ipv4regex)) {
      throw new Error('The given broadcast address is not a valid ipv4:', val);
    }
    return val;
  }
}


/**
 * The AWS discovery validator.
 * @extends DiscoveryOpts
 * @property {String} [region=us-west-1]  The amazon region your instances are in.
 * @property {Number} [maxRetries=3]      In case of error, how often should we retry
 * @property {Boolean} [sslEnabled=true]  Whether connection AWS should be secured or not
 * @property {Number} [maxResults=10]     The maximum number of instances that we will try to ping
 * @property {Number} [port=<listenPort>] The port on which we will attempt to connect with the cluster after discovery
 * @property {Object[]} [filters]         Either a single or multiple filters to choose which instances to ping.
 *                                        For more information on filters check out
 *                                        {@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property}
 * @property {Object} [credentials]       Your AWS credentials. These are required if you're not on an instance with an IAM role
 *                                        For more information check out {@link http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html}
 * @property {String} [credentials.accessKeyId]
 * @property {String} [credentials.secretAccessKey]
 */
class AwsDiscovery extends Validator {
  /**
   * The default options for when you choose AWS for discovery.
   * @return AwsDiscovery
   */
  get default() {
    return {
      region: 'us-east-1',
      maxRetries: 3,
      sslEnabled: true,
      maxResults: 10,
      filters: [],
      port: 22060
    };
  }

  /**
   * Makes sure that filters are an array.
   * @param {Object|Object[]} val
   * @returns {Object[]}
   */
  filters(val) {
    if (val) {
      return _.isArray(val) ? val : [val];
    }
    return [];
  }

  /**
   * Validates the discovery port.
   * @param val
   * @returns {Number|*}
   */
  port(val) {
    val = parseInt(val);
    if (val < 1) {
      throw new Error('Aws discovery port value below valid range');
    }
    if (val > 65535) {
      throw new Error('Aws discovery port value above valid range');
    }
    return val;
  }
}


/**
 * The unicast discovery options validator
 * @extends DiscoveryOpts
 * @property {String[]} hosts  The list of hosts to connect to.
 */
class UnicastDiscovery extends Validator {
  get required() {
    return ['hosts'];
  }

  /**
   * Validate the given host configuration
   * @param {String|String[]} val
   * @returns {String[]}
   */
  hosts(val) {
    val = _.isArray(val) ? val : [val];
    _.map(val, elem => elem.trim());
    _.filter(val, elem => {
      if (elem.length === 0) {
        return false;
      }
      if (!this._isValidHost(elem)) {
        throw new Error('One of the given hosts is not a valid address: ' + elem);
      }
      return true;
    });
    if (!val.length) {
      throw new Error('No valid hosts were found while in the configuration');
    }
    return val;
  }

  /**
   * Check if the string is a host string that nanomsg can connect to.
   * @param {String} host
   * @returns {boolean}
   * @private
     */
  _isValidHost(host) {
    var protocol = host.substr(0, host.indexOf(':'));
    switch (protocol) {
      case 'tcp':
        return !!host.match(/^tcp:\/\/([\d\w]+([\d\w\.]*[\d\w])*|\*):[1-6]?\d{1,4}$/);
      case 'ipc':
        return !!host.match(/^ipc:\/\/[^'"!#$%&+^<=>`]{1,256}$/);
      case 'inproc':
        return !!host.match(/^inproc:\/\/.{1,256}$/);
      case 'pgm':
      case 'epgm':
        return !!host.match(/^e?pgm:\/\/[\d\w]+([\d\w\.]*[\d\w])*(;[\d\w]+([\d\w\.]*[\d\w])*)*:[1-6]?\d{1,4}$/);
      default:
        throw new Error('Unrecognized protocol in unicast discovery: ' + host);
    }
  }
}


/**
 * The validator for local discovery.
 * @extends DiscoveryOpts
 * @property {string} [file=/tmp/zero.service]  The file used to exchange host information
 * @property {number} [interval=1000]           The interval with which we check the file for changes
 */
class LocalDiscovery extends Validator {
  /**
   * The default options for local discovery
   */
  get default() {
    return {
      file: '/tmp/zero.service',
      interval: 1000
    };
  }

  /**
   * Normalizes the given path.
   * @param {String} val
   * @returns {String}
     */
  file(val) {
    return path.normalize(val);
  }

  /**
   * Makes sure the interval is a positive integer.
   * @param {Number|String} val
   * @returns {Number}
     */
  interval(val) {
    val = parseInt(val);
    if (val < 1) {
      throw new Error('The interval for local discovery has to be a positive integer:', val);
    }
    return val;
  }
}

module.exports = Options;
