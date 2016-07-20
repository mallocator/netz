/* global describe, it, beforeEach, afterEach */
var expect = require('chai').expect;

var Options = require('../lib/Options');

describe('Options', () => {
  it('should validate any option that has a validator associated', () => {
    var options = new Options({
      ports: {
        min: 30000,
        max: '31000'
      },
      someComplexOption: {
        thatIsNotValidated: true
      }
    });

    expect(options.ports.min).to.equal(30000);
    expect(options.ports.max).to.equal(31000);
    // Don't allow to modify existing properties
    expect(() => options.ports.min = 29000).to.throw(Error);
    // Allow to do anything on other properties
    options.ports.other = 29000;
    expect(options.ports.other).to.equal(29000);
    // Allow complex objects to be passed in even without validation
    expect(options.someComplexOption.thatIsNotValidated).to.equal(true);
  });

  it('should validate that port ranges are valid', () => {
    expect(() => new Options({
      ports: {
        min: 10,
        max: 9
      }
    })).to.throw(Error);
  });

  it('should validate that defaults are being set properly', () => {
    var options = new Options({});
    expect(options.ports.min).to.equal(40000);
    expect(options.ports.max).to.equal(50000);
  });

  it('should be an event emitter', done => {
    var options = new Options();
    options.once('test', () => {
      done();
    });
    options.emit('test');
  });
});
