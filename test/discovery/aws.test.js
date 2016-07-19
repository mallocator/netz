/* global describe, it, beforeEach, afterEach */
var expect = require('chai').expect;

var aws = require('../../lib/discovery/aws');
var Factory = require('../../lib/Factory');


if (process.env.INTEGRATION) {
  describe('discovery.aws', () => {
    beforeEach(Factory.reset);

    it('should connect to AWS and list all instances', done => {
      Factory.once('error', err => {
        throw err;
      });
      Factory.once('discovered', msg => {
        expect(msg).to.deep.equal(['tcp://ec2-hostname:12345']);
        done();
      });
      // Will connect using environment credentials
      Factory.options = {
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
      };
      aws.discover();
    });
  });
}
