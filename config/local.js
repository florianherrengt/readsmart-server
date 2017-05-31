// @flow
import type { Config } from './index';
import { development } from './development';

// $FlowFixMe
export const local: Config = {
    ...development,
    aws: {
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    }
};
