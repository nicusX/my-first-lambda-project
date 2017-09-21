# My first AWS Lambda project

Node.js, Serverless

Inspired by https://serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb/

## Prerequisites

Node:
```
brew install node
```

NPM:
```
npm install -g serverless
npm install -g mocha
```

**TODO** Should I also install `chai`, `aws-sdk`, `chai`, `bluebird`, `uuid` packages?

## Authentication

Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` env variables.

Load the keypair `.pem` file into ssh agent.
