var shortId = require('shortid');

class Message {
  constructor(payload, id = shortId.generate()) {
    this._payload = payload;
    this._id = id;
  }

  get id() {
    return this._id;
  }

  get payload() {
    return this._payload;
  }
}

module.exports = Message;
