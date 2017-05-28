// @flow
import { development } from './development';
import { production } from './production';
import { test } from './test';

export type Config = {
    postgres?: string
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

if (!selectedEnv.postgres) {
    throw new Error('Cannot find postgres in config');
}

if (!selectedEnv.rabbit) {
    throw new Error('Cannot find rabbit in config');
}

export default selectedEnv;
