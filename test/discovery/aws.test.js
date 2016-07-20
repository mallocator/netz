/* global describe, it, beforeEach, afterEach */
var expect = require('chai').expect;

var AWS = require('../../lib/discovery/aws');
var Options = require('../../lib/Options');


if (process.env.INTEGRATION) {
  describe('discovery.aws', () => {
    it('should connect to AWS and list all instances', done => {
      // Will connect using environment credentials
      let context = new Options({
        debug: console.log,
        listen: 'tcp://127.0.0.1:2206',
        discovery: {
          type: 'aws',
          region: 'us-east-1',
          port: 12345,
          filters: [{
            Name: 'instance.group-name',
            Values: ['securityGroup']
          }]
        }
      });
      context.once('error', err => {
        throw err;
      });
      context.once('discovered', msg => {
        expect(msg).to.deep.equal(['tcp://ec2-hostname:12345']);
        done();
      });

      new AWS(context).discover();
    });
  });
}
