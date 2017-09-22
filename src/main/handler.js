/*
  Lamda event hendlers
*/
'use strict';

const api = require('./app').api;
const githubOAuth = require('./app').githubOAuth;

// Submit Candidate
module.exports.submit = (event, context, callback) => api.submit(event, callback);

// List candidates
module.exports.list = (event, context, callback) => api.list(event, callback);

// Get a Candidate
module.exports.get = (event, context, callback) => api.get(event, callback);


// GitHub OAuth initiate
module.exports.oauthInitiate = (event, context, callback) => githubOAuth.initiate(event, callback);

// GitHub return endpoint, to exchange Auth Code with Access Token
module.exports.oauthExchangeCode = (event, context, callback) => githubOAuth.exchangeCode(event, callback);
