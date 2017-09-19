/*
  Lamda event hendlers
*/
'use strict';

const api = require('./app').api;

// Submit Candidate
module.exports.submit = (event, context, callback) => api.submit(event, callback);

// List candidates
module.exports.list = (event, context, callback) => api.list(event, callback);

// Get a Candidate
module.exports.get = (event, context, callback) => api.get(event, callback);
