// @flow
import type { Config } from './index';
import { development } from './development';
export const test: Config = {
    ...development,
    postgres: 'postgres://postgres@localhost:5432/postgres',
};
