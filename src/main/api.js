/*
  Handles http related aspects, through lambda-proxy
*/

'use strict';

const sendResponse = (callback, statusCode, bodyObject = null, headers = null) => {
  callback(null, {
      statusCode: statusCode,
      body: (bodyObject) ? JSON.stringify( bodyObject ) : null,
      headers: headers,
  });
}

class Api {
  constructor(candidates) {
    this.candidates = candidates;
  }

  // Submit Candidate
  submit(lambdaProxyEvent, callback) {
    //console.log(lambdaProxyEvent);

    const resourceBasePath =  lambdaProxyEvent.requestContext.path

    const requestBody = JSON.parse(lambdaProxyEvent.body);
    const fullname = requestBody.fullname;
    const email = requestBody.email;
    const experience = requestBody.experience;


    if ( !this.candidates.isValid(fullname, email, experience) ) {
        console.error('Validation Failed');
        sendResponse( callback, 400, { message: `Validation failed` });
        return;
    }

    this.candidates.save(fullname, email, experience)
      .then(resId => {
        const resourceLocation = `${resourceBasePath}/${resId}`;
        sendResponse( callback, 201, null, { "Location" : resourceLocation } );
      })
      .catch(err => {
        console.log(err);
        sendResponse( callback, 500, { message: `Unable to submit candidate with email ${email}`} );
      });
  }

  // List candidates
  list(lambdaProxyEvent, callback) {
    //console.log(lambdaProxyEvent);

    this.candidates.list()
      .then(items => {
        sendResponse( callback, 200, { candidates: items });
      })
      .catch(err => {
        console.log(err);
        sendResponse( callback, 500, { message: 'Unable to retrieve candidates' });
      });
  }

  // Get Candidate
  get(lambdaProxyEvent, callback) {
    //console.log(lambdaProxyEvent);

    const candidateId = lambdaProxyEvent.pathParameters.id;

    this.candidates.get(candidateId)
      .then( item =>  item ? sendResponse( callback, 200, item ) : sendResponse( callback, 404, null ) )
      .catch( err => {
        console.log(err);
        sendResponse( callback, 500, { message: `Unable to retrieve candidate id:${candidateId}` });
      });
  }
}


module.exports = Api;
