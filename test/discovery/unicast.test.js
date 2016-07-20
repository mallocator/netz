/* global describe, it, beforeEach, afterEach */
var expect = require('chai').expect;

var Options = require('../../lib/Options');
var Unicast = require('../../lib/discovery/unicast');


describe('discovery.unicast', () => {
  it('should emit the discovered event', done => {
    let context = new Options({
      discovery: {
        type: 'unicast',
        hosts: ['tcp://1.0.0.0:1', 'tcp://1.0.0.0:2']
      }
    });

    context.once('discovered', nodes => {
      expect(nodes.length).to.equal(2);
      expect(nodes[0]).to.deep.equal('tcp://1.0.0.0:1');
      expect(nodes[1]).to.deep.equal('tcp://1.0.0.0:2');
      done();
    });

    new Unicast(context).discover();
  });
});
