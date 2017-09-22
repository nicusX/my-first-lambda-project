'use strict';
/*
  GitHub OAuth authorisation
  https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps/
*/

const httputil = require('../httputil'),
  redirectToResponse = httputil.redirectToResponse,
  endpointUri = httputil.endpointUri;


// Wraps functions handiling GitHub OAuth authorisation
class GithubOAuth {
  constructor(oauthExchangeCodeEndpointPath, gitHubClientId) {
    this.oauthExchangeCodeEndpointPath = oauthExchangeCodeEndpointPath;
    this.gitHubClientId = gitHubClientId;
  }

  // GitHub authorise endpoint URI
  _githHubAutorizeEndpointUrl(event){
    const oauthCompleteUrl = endpointUri(event.headers.Host, event.requestContext.stage, this.oauthExchangeCodeEndpointPath ); // Return URI
    return `http://github.com/login/oauth/authorize?client_id=${this.gitHubClientId}&redirect_uri=${oauthCompleteUrl}`;
  };

  // Initiate endpoint handler
  initiate(lambdaProxyEvent, callback) {
    console.log('Initiate OAuth code grant');

    // Redirect to GitHub authorize endpoint
    const redirectUri = this._githHubAutorizeEndpointUrl(lambdaProxyEvent);
    //console.log(`Return URI: ${redirectUri}`);
    callback(null, redirectToResponse(redirectUri));
  }

  // Exchange Code endpoint handler
  exchangeCode(lambdaProxyEvent, callback) {
    console.log('Exchanging Auth Code for Access Token');
    console.log(lambdaProxyEvent);

    // TODO Extract 'code' from queryStringParameters
    // TODO Post to GitHub Access Token endpoint and retrieve the Access Token (Accept:application/json to receive JSON response)
    // TODO Store the Access Token for the user

    // TODO Redirect to a final endpoint
    callback("Not yet implemented!", null);
  }

}

module.exports = GithubOAuth;
