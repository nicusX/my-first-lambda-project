'use strict';

const chai = require('chai'),
  expect = chai.expect;

const toPromise = require('./utils').toPromise;
const makeLambdaProxyEventForPost = require('./utils').makeLambdaProxyEventForPost;
const makeLambdaProxyEventForGet = require('./utils').makeLambdaProxyEventForGet;

const Api = require('../main/api')
const Candidates = require('../main/candidates');

class MockCandidates extends Candidates {
  constructor(data, forceFail = false) { // TODO Find a better way to simulate failures
    super();
    this.data = data
    this.forceFail = forceFail;
  }

  save(fullname, email, experience) {
    return (this.forceFail)
      ? Promise.reject("error")
      : Promise.resolve('new-id');
  }

  list() {
    return (this.forceFail)
      ? Promise.reject("error")
      : Promise.resolve(
        this.data.map( ({id, fullname, email}) => ({id, fullname, email}) ) // Project the array
      );
  }

  get(id) {
    return (this.forceFail)
      ? Promise.reject("error")
      : Promise.resolve(
        this.data.find( (item) => ( item.id == id ) )
      ); // returns undefined if not found
  }
}


const dummyData = [
  {
    id: '1',
    fullname: 'fullname-1',
    email: 'email-1',
    experience: 42,
    submittedAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  },
  {
    id: '2',
    fullname: 'fullname-2',
    email: 'email-2',
    experience: 43,
    submittedAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  },
];



describe("Candidates", () => {
  const unit = new Api( new MockCandidates( dummyData ) );

  describe('submit', () => {
    const _handler = (evt, cb) => unit.submit(evt, cb);

    it('should return a 201, empty body and Location header', (done) => {
      // Prepare input event
      const inputEvent = makeLambdaProxyEventForPost('/path',
      {
        'fullname' : 'My fullname',
        'email' : 'my@ema.il',
        'experience' : 42,
      });

      toPromise( _handler , inputEvent )
        .then( (res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.not.be.ok;
          expect(res.headers).to.have.property('Location');
        }).then(done,done);
    });

    it('should return 400 if validation fails', (done) => {
      const unit = new Api( new MockCandidates( dummyData ) );

      // Prepare input event
      const inputEvent = makeLambdaProxyEventForPost('/path',
      {
        'fullname' : 'My fullname',
        'email' : 'my@ema.il',
        'experience' : 'this-is-not-number',
      });

      toPromise( _handler, inputEvent )
        .then( (res) => {
          expect(res.statusCode).to.equal(400);
        }).then(done,done);
    });

  });

  describe('list', () => {
    const _handler = (evt, cb) => unit.list(evt, cb);

    it('should return 200 and body containing expectsd JSON', (done) => {
      const inputEvent = makeLambdaProxyEventForGet( '/path' );

      toPromise( _handler, inputEvent)
        .then( (res) => {
            expect(res.statusCode).to.equal(200);
            expect(JSON.parse(res.body)).to.have.property('candidates');
            expect(JSON.parse(res.body).candidates).to.have.lengthOf(2);
        }).then(done,done);
    });


  });

  describe('get', () => {
    const _handler = (evt, cb) => unit.get(evt, cb);

    it('should return 200 and body containing expected item JSON, when id matches', (done) => {
      const matchingInputEvent = makeLambdaProxyEventForGet( '/path', { id: '1'} );

      toPromise( _handler, matchingInputEvent)
        .then( (res) => {
            expect(res.statusCode).to.equal(200);
            expect(JSON.parse(res.body)).to.have.property('id');
            expect(JSON.parse(res.body).id).to.equal('1');
              expect(JSON.parse(res.body).experience).to.equal(42);
        }).then(done,done);
    });

    it('should return 404 when id does not match', (done) => {
      const notMatchingInputEvent = makeLambdaProxyEventForGet( '/path', { id: 'not-exists'} );

      toPromise( _handler, notMatchingInputEvent)
        .then( (res) => {
            expect(res.statusCode).to.equal(404);
        }).then(done,done);
    });

  });
});

describe("Candidates (error handling)", () => {
  const unit = new Api( new MockCandidates( dummyData, true ) ); // Always fail!

  describe('submit', () => {
    const _handler = (evt, cb) => unit.submit(evt, cb);

    it('should return 500 on repository failure', (done) => {

      // Prepare input event
      const inputEvent = makeLambdaProxyEventForPost('/path',
      {
        'fullname' : 'My fullname',
        'email' : 'my@ema.il',
        'experience' : 42,
      });

      toPromise( _handler , inputEvent )
        .then( (res) => {
          expect(res.statusCode).to.equal(500);
        }).then(done,done);
    });
  });

  describe('list', () => {
    const _handler = (evt, cb) => unit.list(evt, cb);

    it('should return 500 on repository failure', (done) => {
      const inputEvent = makeLambdaProxyEventForGet( '/path' );

      toPromise( _handler , inputEvent )
        .then( (res) => {
          expect(res.statusCode).to.equal(500);
        }).then(done,done);
    });

  });

  describe('get', () => {
    const _handler = (evt, cb) => unit.get(evt, cb);

    it('should return 500 on repository failure', (done) => {
      const inputEvent = makeLambdaProxyEventForGet( '/path', { id: 'not-exists'} );

      toPromise( _handler, inputEvent)
        .then( (res) => {
            expect(res.statusCode).to.equal(500);
        }).then(done,done);
    });

  });

});
