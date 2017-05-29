// @flow
import AWS from 'aws-sdk';

AWS.config.update({
    region: 'eu-west-2'
});

const iot = new AWS.Iot();
const sts = new AWS.STS();

const iotRoleName = 'serverless-notifications';

export { AWS, iot, sts, iotRoleName };
