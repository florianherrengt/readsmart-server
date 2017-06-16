// @flow
import type { Context } from '../index';
import md5 from 'md5';
import { withFilter } from 'graphql-subscriptions';
import { POST_ADDED, pubsub } from '../../../common/pubsub';

// setInterval(() => {
//     pubsub.publish(POST_ADDED, { post: { id: 1 } });
//     pubsub.publish(POST_ADDED, { postAdded: { id: Math.random(), title: 'this is a text' } });
//     pubsub.publish(POST_ADDED, { postAdded: { post: { id: 1 } } });
// pubsub.publish(POST_ADDED, { post: post });
// pubsub.publish(POST_ADDED, { postAdded: post });
// pubsub.publish(POST_ADDED, { postAdded: { post: post } });
// }, 1000);

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
            return await context.postRepository.getByKey(key);
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
