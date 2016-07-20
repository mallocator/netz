var fs = require('fs');

var _ = require('lodash');

var Discovery = require('.').Discovery;


class LocalDiscovery extends Discovery {
  /**
   * @param {Context} context
   */
  constructor(context) {
    super(context);
    this._hosts = [];
  }

  discover() {
    this._hosts.push(this._context.listen);
    this._context.on('connected', this.stop.bind(this));
    this._context.on('disconnected', this._start.bind(this));
    this._context.on('nodeAdded', node => {
      this._hosts.push(node.host);
      this._hosts = _.uniq(this._hosts);
    });
    this._context.on('nodeRemoved', node => {
      this._hosts = _.pull(this._hosts, node.host);
    });
    this._start();
  }

  /**
   * Writes the listening host of this instance to a file a start a file watcher.
   */
  _start() {
    fs.readFile(this._context.discovery.file, 'utf8', (err, data) => {
      if (err && err.code == 'ENOENT' || data.indexOf(this._context.listen) == -1) {
        fs.appendFileSync(this._context.discovery.file, this._context.listen + '\n', 'utf8');
      } else {
        this._context.debug('Not appending to shared file in local discovery because host was already added');
      }
      fs.watchFile(this._context.discovery.file, {
        persistent: false,
        interval: this._context.discovery.interval
      }, this._watcher.bind(this));
    });
  }

  /**
   * Stops watching the local file for new hosts.
   */
  stop() {
    fs.unwatchFile(this._context.discovery.file);
    var content = fs.readFileSync(this._context.discovery.file, 'utf8');
    content.replace(this._context.listen + '\n', '');
    fs.writeFileSync(this._context.discovery.file, content, 'utf8');
  }

  /**
   * The watcher function that checks for new hosts.
   * @param {Stats} curr
   * @param {Stats} prev
   * @fires discovered
   */
  _watcher(curr, prev) {
    if (curr.mtime === 0) {
      return this._context.emit(new Error('Local discovery can\'t find file to watch for:', this._context.discovery.file));
    }
    if (curr.mtime != prev.mtime) {
      fs.readFile(this._context.discovery.file, 'utf8', (err, data) => {
        if (err) {
          return this._context.emit('error');
        }
        var nodes = data.split(/\s/);
        nodes = _.filter(_.difference(nodes, this._hosts), entry => entry.trim().length);
        if (nodes.length) {
          this._hosts.concat(nodes);
          this._context.emit('discovered', nodes);
        }
      });
    }
  }
}

module.exports = LocalDiscovery;
