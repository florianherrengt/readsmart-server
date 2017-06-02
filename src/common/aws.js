// @flow
import config from '../../config';
import AWS from 'aws-sdk';

if (!config.aws) {
    throw new Error('config.aws is required');
}

AWS.config.update({ region: config.aws.region });

// $FlowFixMe
AWS.config.apiVersions = config.aws.apiVersions;

// $FlowFixMe
export const s3 = new AWS.S3(config.aws.credentials);
// $FlowFixMe
export const sns = new AWS.SNS(config.aws.credentials);
export const iot = new AWS.Iot();
export const sts = new AWS.STS();
