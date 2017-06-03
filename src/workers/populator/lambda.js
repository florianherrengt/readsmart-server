// @flow
require('babel-core/register');
const { merge } = require('lodash');
const config = require('../../../config').default;
const { s3, iotData } = require('../../common/aws');
const AWS = require('aws-sdk');
const throttle = require('lodash.throttle');

const { Populator } = require('./index');
const agent = require('superagent');

if (!config.aws || !config.aws.s3 || !config.aws.s3.postsBucket) {
    throw new Error('config.aws.s3.postsBucket is required');
}

const populator = new Populator({
    s3,
    iotData,
    agent,
    bucket: config.aws.s3.postsBucket
});

const publish = throttle(() => {
    return new Promise((resolve, reject) => {
        iotData.publish({ topic: 'newsource' }, error => {
            error ? reject(error) : resolve();
        });
    });
}, 1000);

// $FlowFixMe
exports.handler = (event, context, callback) => {
    Promise.all(
        event.Records.map(record => {
            const posts = JSON.parse(record.Sns.Message).posts;
            if (!posts.length) {
                return Promise.resolve();
            }
            return Promise.all(
                posts.map(post => populator(post).then(() => publish()))
            );
        })
    )
        .then(() => callback())
        .catch(error => callback(error));
};
