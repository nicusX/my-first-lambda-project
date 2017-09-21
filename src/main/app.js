// Wires up the application
'use strict';

const AWS = require('aws-sdk');
const DbClient = require('./clients/dbClient');
const Candidates = require('./candidates');
const Api = require('./api');

const dbClient = new DbClient( new AWS.DynamoDB.DocumentClient(), process.env.CANDIDATE_TABLE );
const candidates = new Candidates( dbClient );
const api = new Api(candidates);

AWS.config.setPromisesDependency(require('bluebird'));

module.exports = {
  candidates: candidates,
  api: api,
};
