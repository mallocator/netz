/* global describe, it, beforeEach, afterEach */
let expect = require('chai').expect;

let Netz = require('..');


describe('examples', () => {
  it('should create a local req/rep connection', done => {
    let netz = new Netz();

    let req = netz.req('myReqRes');
    let rep1 = netz.rep('myReqRes');
    let rep2 = netz.rep('myReqRes');

    // One of these will answer
    rep1.on('message', msg => {
      expect(msg).to.equal('request');
      rep1.send('response');
    });

    // One of these will answer
    rep2.on('message', msg => {
      expect(msg).to.equal('request');
      rep2.send('response');
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
    let sub1 = netz.sub('myPubSub');
    let sub2 = netz.sub('myPubSub');
    let sub3 = netz.sub('myPubSub');

    let messages = 0;

    // All of these will receive a message
    sub1.subscribe('mySubject');
    sub1.on('message', (msg, topic) => {
      expect(topic).to.equal('mySubject');
      expect(msg).to.equal('request');
      ++messages == 3 && done();
    });

    // All of these will receive a message
    sub2.subscribe('mySubject');
    sub2.on('message', (msg, topic) => {
      expect(topic).to.equal('mySubject');
      expect(msg).to.equal('request');
      ++messages == 3 && done();
    });

    // All of these will receive a message
    sub3.subscribe('mySubject');
    sub3.on('message', (msg, topic) => {
      expect(topic).to.equal('mySubject');
      expect(msg).to.equal('request');
      ++messages == 3 && done();
    });

    pub.send('request', 'mySubject');
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

    let surveyor = netz.surveyor('mySurvey');
    let respondent1 = netz.respondent('mySurvey');
    let respondent2 = netz.respondent('mySurvey');
    let respondent3 = netz.respondent('mySurvey');

    respondent1.on('message', msg => {
      expect(msg).to.equal('question');
      respondent1.send('answer1');
    });

    respondent2.on('message', msg => {
      expect(msg).to.equal('question');
      respondent2.send('answer1');
    });

    respondent3.on('message', msg => {
      expect(msg).to.equal('question');
      respondent3.send('answer1');
    });

    var messages= 0;

    surveyor.on('message', msg => {
      expect(msg).to.deep.equal('answer1');
      ++messages == 3 && done();
    });

    surveyor.send('question');
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

    let node1 = netz.bus('myBus');
    let node2 = netz.bus('myBus');
    let node3 = netz.bus('myBus');
    let node4 = netz.bus('myBus');

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

    node4.send('broadcast');
  });
});
