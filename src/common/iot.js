// @flow
import config from '../../config';
export const ROLE_NAME = 'serverless-notifications';

export class IotManager {
    iot: any;
    sts: any;
    region: string;
    constructor(params: { iot: any, sts: any }) {
        Object.assign(this, params, {
            region: config.aws.region,
        });
    }
    getCredentials() {
        return new Promise((resolve, reject) => {
            this.iot.describeEndpoint({}, (err, response) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                const { endpointAddress } = response;
                resolve({ endpointAddress });
            });
        })
            .then(({ endpointAddress }) => {
                return new Promise((resolve, reject) => {
                    this.sts.getCallerIdentity({}, (err, { Account } = {}) => {
                        if (err) {
                            console.log(err);
                            return reject(err);
                        }
                        resolve({ Account, endpointAddress });
                    });
                });
            })
            .then(({ endpointAddress, Account }) => {
                const params = {
                    Policy: JSON.stringify({
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Action: ['iot:Connect', 'iot:Receive'],
                                Resource: '*',
                                Effect: 'Allow',
                            },
                            {
                                Effect: 'Allow',
                                Action: ['iot:Subscribe'],
                                Resource: `arn:aws:iot:eu-west-2:${Account}:topicfilter/*`,
                            },
                        ],
                    }),
                    RoleArn: `arn:aws:iam::${Account}:role/${ROLE_NAME}`,
                    RoleSessionName: Math.random().toString(),
                };
                return new Promise((resolve, reject) => {
                    this.sts.assumeRole(params, (err, data) => {
                        if (err) {
                            console.log(err);
                            return reject(err);
                        }
                        const { AccessKeyId, SecretAccessKey, SessionToken } = data.Credentials;
                        resolve({
                            iotEndpoint: endpointAddress,
                            region: this.region,
                            accessKeyId: AccessKeyId,
                            secretKey: SecretAccessKey,
                            sessionToken: SessionToken,
                        });
                    });
                });
            });
    }
}
