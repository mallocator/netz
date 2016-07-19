/* global describe, it, beforeEach, afterEach */
var expect = require('chai').expect;

var Factory = require('../../lib/Factory');
var Unicast = require('../../lib/discovery/unicast');


describe('discovery.unicast', () => {
  beforeEach(Factory.reset);

  it('should emit the discovered event', done => {


    Factory.once('discovered', nodes => {
      expect(nodes.length).to.equal(2);
      expect(nodes[0]).to.deep.equal('tcp://1.0.0.0:1');
      expect(nodes[1]).to.deep.equal('tcp://1.0.0.0:2');
      done();
    });

    Factory.options = {
      discovery: {
        type: 'unicast',
        hosts: ['tcp://1.0.0.0:1', 'tcp://1.0.0.0:2']
      }
    };

    new Unicast().discover();
  });
});
