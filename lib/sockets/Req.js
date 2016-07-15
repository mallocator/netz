var Transmitter = require('../Transmitter');

class Req extends Transmitter {
  constructor(node, name) {
    super(node, name, 'req');
  }
}
