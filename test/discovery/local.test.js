/* global describe, it, beforeEach, afterEach */
var fs = require('fs');
var path = require('path');

var expect = require('chai').expect;

var Options = require('../../lib/Options');
var Local = require('../../lib/discovery/local');


/**
 * File used during test for interprocess communication.
 */
var tmpFile = path.join(__dirname, 'tmp');

describe('discovery.local', () => {
  afterEach(function() {
    fs.unlinkSync(tmpFile);
  });

  it('should emit the discovered event', done => {
    let context = new Options({
      listen: 'tcp://127.0.0.1:12345',
      debug: () => {},
      discovery: {
        type: 'local',
        file: tmpFile,
        interval: 10
      }
    });
    context.once('error', err => {
      throw err;
    });
    context.once('discovered', nodes => {
      expect(nodes.length).to.equal(1);
      expect(nodes[0]).to.deep.equal('tcp://127.0.0.1:54321');
      expect(fs.readFileSync(tmpFile, 'utf8')).to.equal('tcp://127.0.0.1:12345\ntcp://127.0.0.1:54321\n');
      context.once('connected', done);
      context.emit('connected');
    });

    new Local(context).discover();

    fs.appendFile(tmpFile, 'tcp://127.0.0.1:54321\n', 'utf8');
  });
});
