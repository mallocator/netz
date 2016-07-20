/* global describe, it, beforeEach, afterEach */
var EventEmitter = require('eventemitter2');
var expect = require('chai').expect;

var Node = require('../lib/Node');
var Req = require('../lib/sockets/Req');


describe('Service', () => {
  it('should create a new Socket and set all the right properties', () => {
    var node = new Node('localhost');
    var req = new Req(new EventEmitter(), node, 'testReq');
    expect(req.type).to.equal('Req');
  });
});
