// @flow
import type { Config } from './index';
import { defaultEnv } from './default';

export const development: Config = {
    ...defaultEnv,
    postgres: 'postgres://postgres@localhost:5432/postgres',
    redis: 'redis://localhost:6379',
    apiUrl: `http://localhost:${process.env.PORT || '8000'}`,
    clientUrl: 'http://localhost:3000',
};
