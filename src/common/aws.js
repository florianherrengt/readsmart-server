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
// $FlowFixMe
export const iot = new AWS.Iot(config.aws.credentials);

export let iotData = new AWS.IotData({
    endpoint: 'aqe9yfh30d9cw.iot.eu-west-2.amazonaws.com',
    // $FlowFixMe
    ...config.aws.credentials
});

// $FlowFixMe
export const sts = new AWS.STS(config.aws.credentials);
