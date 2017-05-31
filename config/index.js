// @flow
import { merge } from 'lodash';
import { development } from './development';
import { production } from './production';
import { test } from './test';

export type Config = {
    postgres?: string,
    extractorUrl?: string,
    aws?: {
        region?: string,
        apiVersions?: {
            lambda: string,
            s3: string
        },
        config?: {
            accessKeyId?: string,
            secretAccessKey?: string
        },
        s3?: {
            apiVersion: string,
            postsBucket?: string
        }
    }
};

const env = process.env.NODE_ENV || 'development';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const allEnvs = {
    development,
    test,
    production
};

const selectedEnv: Config = allEnvs[env];

console.log({ selectedEnv });

const extendedEnv: Config = merge(selectedEnv, {
    extractorUrl: 'https://dj96a3dxm6.execute-api.us-east-1.amazonaws.com/prod',
    aws: {
        region: process.env.REGION || 'eu-west-2',
        apiVersions: {
            lambda: '2015-03-31',
            s3: '2006-03-01'
        },
        s3: {
            postsBucket: process.env.POSTS_BUCKET || 'readsmart-dev-posts'
        }
    }
});

export default extendedEnv;
