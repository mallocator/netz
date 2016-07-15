var fs = require('fs');

var _ = require('lodash');

var Factory = require('../Factory');


/**
 * A list of all known hosts.
 * @type {string[]}
 */
exports.knownHosts = [];

/**
 * This method really doesn't do much other than return the list it was given.
 */
exports.discover = function () {
  exports.knownHosts.push(Factory.options.listen);
  Factory.emitter.on('connected', exports.stop);
  Factory.emitter.on('disconnected', exports.start);
  Factory.emitter.on('nodeAdded', node => {
    exports.knownHosts.push(node.host);
    exports.knownHosts = _.uniq(exports.knowHost);
  });
  Factory.emitter.on('nodeRemoved', node => {
    exports.knownHosts = _.pull(exports.knownHosts, node.host);
  });
  exports.start();
};

/**
 * Writes the listening host of this instance to a file a start a file watcher.
 */
exports.start = function() {
  fs.readFile(Factory.options.discovery.file, 'utf8', (err, data) => {
    if (err && err.code == 'ENOENT' || data.indexOf(Factory.options.listen) == -1) {
      fs.appendFileSync(Factory.options.discovery.file, Factory.options.listen + '\n', 'utf8');
    } else {
      exports.options.debug('Not appending to shared file in local discovery because host was already added');
    }
    fs.watchFile(Factory.options.discovery.file, {
      persistent: false,
      interval: Factory.options.discovery.interval
    }, exports.watcher);
  });
};

/**
 * The watcher function that checks for new hosts.
 * @param {Stats} curr
 * @param {Stats} prev
 * @fires discovered
 */
exports.watcher = function(curr, prev) {
  if (curr.mtime === 0) {
    return Factory.emitter.emit(new Error('Local discovery can\'t find file to watch for:', Factory.options.discovery.file));
  }
  if (curr.mtime != prev.mtime) {
    fs.readFile(Factory.options.discovery.file, 'utf8', (err, data) => {
      if (err) {
        return Factory.emitter.emit('error');
      }
      var nodes = data.split(/\s/);
      nodes = _.filter(_.difference(nodes, exports.knownHosts), entry => entry.trim().length);
      if (nodes.length) {
        exports.knownHosts.concat(nodes);
        Factory.emitter.emit('discovered', nodes);
      }
    });
  }
};

/**
 * Stops watching the local file for new hosts.
 */
exports.stop = function() {
  fs.unwatchFile(Factory.options.discovery.file, exports.watcher);
  var content = fs.readFileSync(Factory.options.discovery.file, 'utf8');
  content.replace(Factory.options.listen + '\n', '');
  fs.writeFileSync(Factory.options.discovery.file, content, 'utf8');
};
