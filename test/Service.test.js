/* global describe, it, beforeEach, afterEach */
var EventEmitter = require('eventemitter2');
var expect = require('chai').expect;

var Node = require('../lib/Node');
var Req = require('../lib/sockets/Req');


describe('Service', () => {
  it('should create a new Socket and set all the right properties', () => {
    var context = new EventEmitter();
    var node = new Node(context, 'localhost');
    var req = new Req(context, node, 'testReq');
    expect(req.type).to.equal('Req');
  });
});
