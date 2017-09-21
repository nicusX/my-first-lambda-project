
// Assumes handler(inputData, callback) and callback(err, success)
module.exports.toPromise = (handler, inputData) =>
  new Promise( (resolve, reject) =>
    handler(inputData, (err, success) =>
      err ? reject(err) : resolve(success) )
  );

// Creates a simple lambda-proxy event (for a POST), just including the body and path
module.exports.makeLambdaProxyEventForPost = (path, bodyObject) => {
  return {
    httpMethod: 'POST', // Not actually used by tests
    body: JSON.stringify( bodyObject ),
    requestContext:  {
        path: path,
    },
  }
};

// Creates a simple lambdaProxy event for a GET with optional pathParameters (as object) and queryStringParameters
module.exports.makeLambdaProxyEventForGet = (path, pathParameters = null, queryStringParameters = null) => {
  return {
    httpMethod: 'GET', // Not actually used by tests
    pathParameters: pathParameters,
    queryStringParameters: queryStringParameters,
    requestContext:  {
        path: path,
    },
  }
};
