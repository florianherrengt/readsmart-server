// @flow
import type { Context } from '../index';

export const resolvers = {
    Query: {
        async currentUser(root: any, args: any, context: Context) {
            return context.session && context.session.passport ? context.session.passport.user : null;
        },
    },
};
