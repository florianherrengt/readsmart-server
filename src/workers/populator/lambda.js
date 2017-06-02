// @flow
require('babel-core/register');
const { merge } = require('lodash');
const config = require('../../../config').default;
const { s3 } = require('../../common/aws');
const AWS = require('aws-sdk');

const { Populator } = require('./index');
const agent = require('superagent');

if (!config.aws || !config.aws.s3 || !config.aws.s3.postsBucket) {
    throw new Error('config.aws.s3.postsBucket is required');
}

const populator = new Populator({
    s3,
    agent,
    bucket: config.aws.s3.postsBucket
});

// $FlowFixMe
exports.handler = (event, context, callback) => {
    Promise.all(
        event.Records.map(record =>
            Promise.all(
                JSON.parse(record.Sns.Message).posts.map(post =>
                    populator(post)
                )
            )
        )
    )
        .then(() => callback())
        .catch(error => callback(error));
};
