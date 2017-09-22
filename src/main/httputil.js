// Generate a Redirect response
module.exports.redirectToResponse = (uri) => ({
    statusCode: 302,
    headers: {
      Location: uri
    },
});

// Make API Gateway endpoint absolute uri
module.exports.endpointUri = (host, stage, path) => ( `https://${host}/${stage}/${path}` );
