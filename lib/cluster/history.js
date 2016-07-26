var Message = require('./message');

/**
 * A history id entry that will delete itself after a given time.
 */
class IdEntry {
  /**
   *
   * @param {IdHistory} history A reference to the history object that holds all entries
   * @param {String} id         A unique id that is used to find this entry later again
   * @param {Number} ttl        The time how long this entry should exist in ms.
     */
  constructor(history, id, ttl) {
    this._id = id;
    this._timeout = setTimeout(() => history.remove(id), ttl);
  }

  /**
   * Return this id of this entry.
   * @returns {String}
   */
  get id() {
    return this._id;
  }

  /**
   * Clears the timeout that would clean this object by itself.
   */
  stop() {
    clearTimeout(this._timeout);
  }
}

/**
 * A helper collection used to store message ids that will clean itself over time.
 */
class IdHistory {
  /**
   * @param {Context} context
   */
  constructor(context) {
    this._context = context;
    this._map = {};
    this._queue = [];
  }

  /**
   * Add an id to the history. It will be removed after the configured ttl automatically.
   * @param {Message|String} id
   */
  add(id) {
    id = id instanceof Message ? id.id : id;
    let entry = new IdEntry(this, id, this._context.cluster.history.ttl);
    this._map[id] = entry;
    this._queue.push(entry);
    if (this._queue.length > this._context.cluster.history.size) {
      let purged = this._queue.shift();
      delete this._map[purged.id];
    }
  }

  /**
   * Removes the given id from history.
   * @param id
     */
  remove(id) {
    this._map[id] && this._map[id].stop();
    delete this._map[id];
    this._queue.filter(elem => elem.id !== id);
  }

  /**
   * Check if an id is recorded in the history.
   * @param {String} id The id to check for
   * @returns {boolean} Return true if it exists, otherwise false.
   */
  getById(id) {
    return !!this._map[id];
  }
}

module.exports = IdHistory;
