var fs = require('fs');

var _ = require('lodash');

var Discovery = require('.').Discovery;
var Factory = require('../Factory');


class LocalDiscovery extends Discovery {
  constructor() {
    super();
    this._hosts = [];
  }

  discover() {
    this._hosts.push(Factory.options.listen);
    Factory.emitter.on('connected', this._stop.bind(this));
    Factory.emitter.on('disconnected', this._start.bind(this));
    Factory.emitter.on('nodeAdded', node => {
      this._hosts.push(node.host);
      this._hosts = _.uniq(this._hosts);
    });
    Factory.emitter.on('nodeRemoved', node => {
      this._hosts = _.pull(this._hosts, node.host);
    });
    this._start();
  }

  /**
   * Writes the listening host of this instance to a file a start a file watcher.
   */
  _start() {
    fs.readFile(Factory.options.discovery.file, 'utf8', (err, data) => {
      if (err && err.code == 'ENOENT' || data.indexOf(Factory.options.listen) == -1) {
        fs.appendFileSync(Factory.options.discovery.file, Factory.options.listen + '\n', 'utf8');
      } else {
        Factory.options.debug('Not appending to shared file in local discovery because host was already added');
      }
      fs.watchFile(Factory.options.discovery.file, {
        persistent: false,
        interval: Factory.options.discovery.interval
      }, this._watcher.bind(this));
    });
  }

  /**
   * Stops watching the local file for new hosts.
   */
  _stop() {
    fs.unwatchFile(Factory.options.discovery.file, this._watcher);
    var content = fs.readFileSync(Factory.options.discovery.file, 'utf8');
    content.replace(Factory.options.listen + '\n', '');
    fs.writeFileSync(Factory.options.discovery.file, content, 'utf8');
  }

  /**
   * The watcher function that checks for new hosts.
   * @param {Stats} curr
   * @param {Stats} prev
   * @fires discovered
   */
  _watcher(curr, prev) {
    if (curr.mtime === 0) {
      return Factory.emitter.emit(new Error('Local discovery can\'t find file to watch for:', Factory.options.discovery.file));
    }
    if (curr.mtime != prev.mtime) {
      fs.readFile(Factory.options.discovery.file, 'utf8', (err, data) => {
        if (err) {
          return Factory.emitter.emit('error');
        }
        var nodes = data.split(/\s/);
        nodes = _.filter(_.difference(nodes, this._hosts), entry => entry.trim().length);
        if (nodes.length) {
          this._hosts.concat(nodes);
          Factory.emitter.emit('discovered', nodes);
        }
      });
    }
  }
}

module.exports = LocalDiscovery;
