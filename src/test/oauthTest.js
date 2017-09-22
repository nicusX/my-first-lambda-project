'use strict';

const expect = require('chai').expect;

const testUtils = require('./utils'),
  toPromise = testUtils.toPromise;

const GithubOAuth = require('../main/github/oauth');



describe("GithubOAuth", () => {
  const host = 'my.host';
  const stage = 'test';
  const exchangePath = '/exchange-path';
  const githubClientId = 'my-client-id';
  const unit = new GithubOAuth(exchangePath, githubClientId);

  describe('initiate', () => {
    const _handler = (evt, cb) => unit.initiate(evt, cb);;

    it('should return 302 to GitHub, including client_id and return URI', (done) => {
      const initiateEvent = {
        httpMethod: 'GET', // Not actually used by tests
        headers : {
          Host: host
        },
        requestContext:  {
            path: '/path',
            stage: stage,
        },
      };

      toPromise( _handler, initiateEvent )
        .then( (res) => {
            expect(res.statusCode).to.equal(302);
            expect(res.headers).to.have.property('Location');
            expect(res.headers.Location).to.match(new RegExp('^http://github\.com/login/oauth/authorize'));
            expect(res.headers.Location).to.match(new RegExp(`client_id=${githubClientId}`));
            expect(res.headers.Location).to.match(new RegExp(`redirect_uri=https://${host}/${stage}/${exchangePath}`));
        }).then(done,done);


    });
  });
});
