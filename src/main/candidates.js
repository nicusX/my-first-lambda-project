/*
  Repository/Service handling Candidates
*/

'use strict';

const uuid = require('uuid');

const makeCandidate = (fullname, email, experience) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    fullname: fullname,
    email: email,
    experience: experience,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};

// Wraps candidates handling functions
class Candidates {
  constructor(dbClient) {
    this.db = dbClient;
  }


  // Validate candidate
  isValid(fullname, email, experience) {
    return (typeof fullname === 'string' && typeof email === 'string' && typeof experience === 'number');
  }

  // Save Candidate (returns promise with the id)
  save(fullname, email, experience) {
    console.log(`Saving candidate ${fullname}`);

    const candidate = makeCandidate(fullname, email, experience);

    return this.db.put( candidate )
      .then( res => res.id );
  }


  // List all Candidates (returns promise)
  list() {
    console.log("List all Candidates.");

    return this.db.list( "id, fullname, email" );
  }


  // Get one Candidate
  get(id) {
    console.log(`Retrieving Candidate id:${id}`);

    return this.db.get( 'id', id );
  }
}


module.exports = Candidates;
