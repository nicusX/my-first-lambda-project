'use strict';


// Absolute URL for the OAuth-complete return endpoint
const oauthCompleteUrl = (lambdaProxyEvent, oauthCompleteEndpointPath) => ( `https://${lambdaProxyEvent.headers.Host}/${lambdaProxyEvent.requestContext.stage}${oauthCompleteEndpointPath}` );

// URL of GitHub authorise endpoint
const githHubAutorizeEndpointUrl = (lambdaProxyEvent, gitHubClientId) => ( `http://github.com/login/oauth/authorize?client_id=${gitHubClientId}&redirect_uri=${oauthCompleteUrl(lambdaProxyEvent)}` );

// Generates a Redirect response
// TODO Can be moved to an util module
const redirectToResponse = (uri) => ({
    statusCode: 302,
    headers: {
      Location: uri
    },
});

// Wraps functions handiling GitHub OAuth authorisation
class GithubOAuth {
  constructor(oauthCompleteEndpointPath, gitHubClientId) {
    this.oauthCompleteEndpointPath = oauthCompleteEndpointPath;
    this.gitHubClientId = gitHubClientId;
  }

  // Initiate endpoint handler
  initiate(lambdaProxyEvent, callback) {
    console.log('Initiate OAuth code grant');

    // Redirect to GitHub authorize endpoint
    const redirectUri = githHubAutorizeEndpointUrl(lambdaProxyEvent, this.gitHubClientId);
    callback(null, redirectToResponse(redirectUri));
  }

  // Complete endpoint handler
  complete(lambdaProxyEvent, callback) {
    console.log('Returning Auth Code from GitHub');
    console.log(lambdaProxyEvent);

    // TODO Implement
    callback("Not yet implemented!", null);
  }

}

module.exports = GithubOAuth;
