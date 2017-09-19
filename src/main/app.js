// Wires up the application
'use strict';

const AWS = require('aws-sdk');
const Candidates = require('./candidates');
const Api = require('./api');

const candidates = new Candidates( new AWS.DynamoDB.DocumentClient() );
const api = new Api(candidates);

AWS.config.setPromisesDependency(require('bluebird'));

module.exports = {
  candidates: candidates,
  api: api,
};
