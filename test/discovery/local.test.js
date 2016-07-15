/* global describe, it, beforeEach, afterEach */
var fs = require('fs');
var path = require('path');

var expect = require('chai').expect;

var Factory = require('../../lib/Factory');
var local = require('../../lib/discovery/local');


/**
 * File used during test for interprocess communication.
 */
var tmpFile = path.join(__dirname, 'tmp');

describe('discovery.local', () => {
  beforeEach(Factory.reset);

  afterEach(function() {
    fs.unlinkSync(tmpFile);
    local.knowHost = [];
  });

  it('should emit the discovered event', done => {
    Factory.options = {
      listen: 'tcp://127.0.0.1:12345',
      discovery: {
        type: 'local',
        file: tmpFile,
        interval: 10
      }
    };
    Factory.emitter.once('error', err => {
      throw err;
    });
    Factory.emitter.once('discovered', nodes => {
      expect(nodes.length).to.equal(1);
      expect(nodes[0]).to.deep.equal('tcp://127.0.0.1:54321');
      expect(fs.readFileSync(tmpFile, 'utf8')).to.equal('tcp://127.0.0.1:12345\ntcp://127.0.0.1:54321\n');
      Factory.emitter.once('connected', done);
      Factory.emitter.emit('connected');
    });

    local.discover();

    fs.appendFile(tmpFile, 'tcp://127.0.0.1:54321\n', 'utf8');
  });
});
