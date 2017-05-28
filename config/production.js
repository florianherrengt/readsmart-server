// @flow
import type { Config } from './index';
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw Error('process.env.DATABASE_URL is undefined');
}
export const production: Config = {
    postgres: DATABASE_URL
};
