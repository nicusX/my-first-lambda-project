'use strict';

const expect = require('chai').expect;


const DbClient = require('../main/clients/DbClient');
const Candidates = require('../main/candidates');

class MockDbClient extends DbClient {
  constructor(data) {
    super();
    this.data = data;
  }

  put(item) {
    return Promise.resolve(item);
  }

  list(projection = null) {
      return Promise.resolve(this.data); // Ignore projection
  }

  get(idKey, idValue) {
    for(let item of this.data) {
      if ( item[idKey] == idValue ) {
        return Promise.resolve(item);
      }
    }
    return Promise.resolve(null); // TODO is this the correct behaviour?
  }
};


const dummyData = [
  {
    id: '1',
    fullname: 'fullname-1',
    email: 'email-1',
    experience: 1,
    submittedAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  },
  {
    id: '2',
    fullname: 'fullname-2',
    email: 'email-2',
    experience: 2,
    submittedAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  },
];

const candidates = new Candidates( new MockDbClient( dummyData ) );

describe("Candidates", () => {

  describe("save", () => {
    it("should return a string id", (done) => {
      candidates.save('My Name','my@ema.il', 1)
      .then( (res) => {
        expect(res).to.be.a('string');
      }).then(done,done); // See https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35
    });
  });

  describe("get", () => {
    it("should return a Candidate for an existing id", (done) => {
      candidates.get('1')
      .then( (res) => {
        expect(res.id).to.equal('1');
        expect(res.fullname).to.equal('fullname-1');
      }).then(done,done);
    });

    it("should return something evaluating false for non-existing id", (done) => {
      candidates.get('42')
      .then( (res) => {
        expect(res).to.not.be.ok;
      }).then(done,done);
    });

  });

  describe("list", () => {
    it("should return all data", (done) => {
      candidates.list()
      .then( (res) => {
          expect(res).to.have.lengthOf( 2 );
      }).then(done,done);
    });
  });

});
