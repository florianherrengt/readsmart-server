// @flow
import type { Context } from '../index';
import { iot, sts } from '../../../common/aws';
import { IotManager } from '../../../common/iot';

const iotManager = new IotManager({ iot, sts });

export const resolvers = {
    Query: {
        async iotConnection(root: any, args: any, context: Context) {
            return await iotManager.getCredentials();
        }
    }
};
