// @flow
export class IotManager {
    iot: any;
    sts: any;
    region: string;
    static roleName = 'serverless-notifications';
    contructor({
        iot,
        sts,
        region = 'eu-west-2'
    }: { iot: any, sts: any, region: string }) {
        this.iot = iot;
        this.sts = sts;
        this.region = region;
    }
    getCredentials() {
        new Promise((resolve, reject) => {
            this.iot.describeEndpoint({}, (err, { endpointAddress } = {}) => {
                if (err) {
                    return reject(err);
                }
                resolve({ endpointAddress });
            });
        })
            .then(({ endpointAddress }) => {
                return new Promise((resolve, reject) => {
                    this.sts.getCallerIdentity({}, (err, { Account } = {}) => {
                        if (err) {
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
                                Effect: 'Allow'
                            },
                            {
                                Effect: 'Allow',
                                Action: ['iot:Subscribe'],
                                Resource: `arn:aws:iot:eu-west-2:${Account}:topicfilter/test`
                            }
                        ]
                    }),
                    RoleArn: `arn:aws:iam::${Account}:role/${IotManager.roleName}`,
                    RoleSessionName: Math.random().toString()
                };
                return new Promise((resolve, reject) => {
                    this.sts.assumeRole(params, (err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        const {
                            AccessKeyId,
                            SecretAccessKey,
                            SessionToken
                        } = data.Credentials;
                        resolve({
                            iotEndpoint: endpointAddress,
                            region: this.region,
                            accessKeyId: AccessKeyId,
                            secretKey: SecretAccessKey,
                            sessionToken: SessionToken
                        });
                    });
                });
            });
    }
}
