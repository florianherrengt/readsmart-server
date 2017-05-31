// @flow
import config from '../../config';
import AWS from 'aws-sdk';

if (!config.aws) {
    throw new Error('config.aws is required');
}

AWS.config.apiVersions = config.aws.apiVersions;

export const s3 = new AWS.S3();
export const iot = new AWS.Iot();
export const sts = new AWS.STS();
