/* global describe, it, beforeEach, afterEach */
let expect = require('chai').expect;

let Netz = require('..');


describe('examples', () => {
  it('should create a local req/rep connection', done => {
    let netz = new Netz();

    let req = netz.req('myReqRes');
    let res = netz.res('myReqRes');

    res.on('message', msg => {
      expect(msg).to.equal('request');
      res.send('response');
    });

    req.on('message', msg => {
      expect(msg).to.equal('response');
      done();
    });

    req.send('request');
  });

  it('should create a local pub/sub connection', done => {
    let netz = new Netz();

    let pub = netz.pub('myPubSub');
    let sub = netz.sub('myPubSub');

    sub.subscribe('mySubject');
    sub.on('message', msg => {
      expect(msg).to.equal('mySubject request');
      done();
    });

    pub.send('mySubject request');
  });

  it('should create a local pipeline', done => {
    let netz = new Netz();

    let push1 = netz.push('myStep1');
    let pull1 = netz.pull('myStep1');

    let push2 = netz.push('myStep2');
    let pull2 = netz.pull('myStep2');

    pull1.on('message', msg => {
      expect(msg).to.equal('payload');
      push2.send(msg + '2');
    });

    pull2.on('message', msg => {
      expect(msg).to.equal('payload2');
      done();
    });

    push1.send('payload');
  });

  it('should create a local survey', done => {
    let netz = new Netz();

    let survey = netz.survey('mySurvey');
    let respondent = netz.respondent('mySurvey');

    respondent.on('message', msg => {
      expect(msg).to.equal('question');
      respondent.send('answer1');
    });

    survey.on('message', msg => {
      expect(msg).to.deep.equal('answer1');
      done();
    });

    survey.send('question');
  });

  it('should create a local pair connection', done => {
    let netz = new Netz();

    let pair1 = netz.pair('myPair');
    let pair2 = netz.pair('myPair');

    pair2.on('message', msg => {
      expect(msg).to.equal('request');
      pair2.send('response');
    });

    pair1.on('message', msg => {
      expect(msg).to.equal('response');
      done();
    });

    pair1.send('request');
  });

  it('should create a local bus', done => {
    let netz = new Netz();

    let node1 = netz.pub('myBus');
    let node2 = netz.sub('myBus');
    let node3 = netz.sub('myBus');
    let node4 = netz.sub('myBus');

    let messages = 0;

    node1.on('message', msg => {
      expect(msg).to.equal('broadcast');
      ++messages == 3 && done();
    });

    node2.on('message', msg => {
      expect(msg).to.equal('broadcast');
      ++messages == 3 && done();
    });

    node3.on('message', msg => {
      expect(msg).to.equal('broadcast');
      ++messages == 3 && done();
    });

    node4.send('request');
  });
});
