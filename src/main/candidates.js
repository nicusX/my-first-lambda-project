/*
  "business logic" handling candidates
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
  constructor(dynamoDocClient) {
    this.db = dynamoDocClient;
  }


  // Validate candidate
  isValid(fullname, email, experience) {
    return (typeof fullname === 'string' && typeof email === 'string' && typeof experience === 'number');
  }

  // Save Candidate (returns promise)
  save(fullname, email, experience) {
    console.log(`Saving candidate ${fullname}`);

    const candidate = makeCandidate(fullname, email, experience);

    const dbCandidate = {
      TableName: process.env.CANDIDATE_TABLE,
      Item: candidate,
    };

    return this.db.put(dbCandidate).promise()
      .then(res => candidate);
  }


  // List all Candidates (returns promise)
  list() {
    console.log("List all Candidates.");

    const params = {
        TableName: process.env.CANDIDATE_TABLE,
        ProjectionExpression: "id, fullname, email"
    };

    return this.db.scan(params).promise()
      .then(data => data.Items );
  }


  // Get one Candidate
  get(id) {
    console.log(`Retrieving Candidate id:${id}`);

    const params = {
      TableName: process.env.CANDIDATE_TABLE,
      Key: {
        id: id,
      },
    };

    return this.db.get(params).promise()
      .then(data => data.Item );
  }
}


module.exports = Candidates;
