// @flow
import type { Config } from './index';
const { DATABASE_URL, REDIS_URL } = process.env;
import { defaultEnv } from './default';

export const production: Config = {
    ...defaultEnv,
    postgres: DATABASE_URL || '',
    redis: REDIS_URL || '',
    apiUrl: 'https://readsmart.herokuapp.com',
    clientUrl: 'http://readsmart.s3-website.eu-west-2.amazonaws.com',
};
