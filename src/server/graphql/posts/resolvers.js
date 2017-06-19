// @flow
import type { Context } from '../index';
import { withFilter } from 'graphql-subscriptions';
import { POST_ADDED, pubsub } from '../../../common/pubsub';

export const resolvers = {
    Query: {
        async redditPosts(root: any, { sub }: { sub: string }, context: Context) {
            const posts = await context.postRepository.getReddit(sub);
            const populatedPosts = await context.postRepository.populate({
                type: `reddit:${sub}`,
                posts,
            });
            return {
                count: posts.length,
                posts: populatedPosts,
            };
        },
        async post(root: any, { key }: { key: string }, context: Context) {
            // return await context.postRepository.getByKey(key);
        },
    },
    Subscription: {
        postAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(POST_ADDED),
                (payload, variables, context) => {
                    console.log(context);
                    return true;
                },
            ),
        },
    },
};
