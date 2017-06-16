// @flow
import fs from 'fs';
import path from 'path';
const local = fs.existsSync(path.join(__dirname, './local.js')) ? require('./local').local : {};
import { merge } from 'lodash';
import { development } from './development';
import { production } from './production';
import { test } from './test';
// import { local } from './local';

export type Config = {
    postgres: string,
    extractorUrl: string,
    apiUrl: string,
    clientUrl: string,
    redis?: string,
    aws: {
        region?: string,
        apiVersions?: {
            lambda: string,
            s3: string,
        },
        credentials?: {
            accessKeyId?: string,
            secretAccessKey?: string,
        },
        s3?: {
            apiVersion: string,
            postsBucket?: string,
        },
        sns?: {
            topics: {
                populatePostsTopic: string,
            },
        },
    },
    twitter: {
        key: string,
        secret: string,
    },
};

const env = process.env.NODE_ENV || 'development';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const allEnvs = {
    development,
    test,
    local,
    production,
};

const selectedEnv: Config = allEnvs[env];

export default selectedEnv;
