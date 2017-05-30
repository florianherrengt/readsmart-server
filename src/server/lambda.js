// @flow
require('babel-core/register');

const awsServerlessExpress = require('aws-serverless-express');
const { app } = require('./index');

const server = awsServerlessExpress.createServer(app);

// $FlowFixMe
exports.handler = (event, context) =>
    awsServerlessExpress.proxy(server, event, context);
