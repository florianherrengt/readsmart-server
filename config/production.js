// @flow
import type { Config } from './index';
const DATABASE_URL = process.env.DATABASE_URL;

export const production: Config = {
    postgres: DATABASE_URL || ''
};
