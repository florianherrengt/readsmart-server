// @flow
import type { Config } from './index';
const { DATABASE_URL, REDIS_URL } = process.env;
import { defaultEnv } from './default';

export const production: Config = {
    ...defaultEnv,
    postgres: DATABASE_URL || '',
    redis: REDIS_URL || '',
    apiUrl: `http://localhost:${process.env.PORT || '8000'}`,
    clientUrl: 'http://localhost:3000',
};
