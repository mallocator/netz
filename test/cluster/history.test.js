/* global describe, it, beforeEach, afterEach */
let expect = require('chai').expect;

let History = require('../../lib/cluster/history');


describe('History', () => {
  it('should create entries that are accessible immediately', () => {
    let history = new History({
        cluster: {
          history: {
            ttl: 1000,
            size: 10
          }
        }
    });

    history.add('testid');
    expect(history.getById('testid')).to.be.true;
  });

  it('should purge entries that are older than the given ttl', done => {
    let history = new History({
      cluster: {
        history: {
          ttl: 10,
          size: 10
        }
      }
    });

    history.add('testid');
    setTimeout(() => {
      expect(history.getById('testid')).to.be.false;
      done();
    }, 15);
  });

  it('should purge entries if the size limit has been reached', () => {
    let history = new History({
      cluster: {
        history: {
          ttl: 1000,
          size: 3
        }
      }
    });

    history.add('testid1');
    history.add('testid2');
    history.add('testid3');
    history.add('testid4');
    expect(history.getById('testid1')).to.be.false;
    expect(history.getById('testid2')).to.be.true;
  });
});
