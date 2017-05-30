// @flow
import type { Context } from '../../index';

export type Args = {
    sub: string
};

export const resolvers = {
    Query: {
        async redditPosts(root: any, { sub }: Args, context: Context) {
            return {
                count: 10,
                posts: [
                    {
                        title: 'bla',
                        text: 'sdfsfs'
                    }
                ]
            };
        }
    }
};
