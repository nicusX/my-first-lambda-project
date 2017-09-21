// Wires up the application
'use strict';

const AWS = require('aws-sdk');
const DbClient = require('./clients/dbClient');
const Candidates = require('./candidates');
const Api = require('./api');
const GithubOAuth = require('./github/oauth');

const dbClient = new DbClient( new AWS.DynamoDB.DocumentClient(), process.env.CANDIDATE_TABLE );
const candidates = new Candidates( dbClient );
const api = new Api(candidates);
const githubOAuth = new GithubOAuth('/oauth-complete', process.env.GITHUB_CLIENT_ID); // TODO Can't I get the endpoint path from the environment?,

AWS.config.setPromisesDependency(require('bluebird')); // TODO Is this required?

module.exports = {
  api: api,
  githubOAuth: githubOAuth,
};
