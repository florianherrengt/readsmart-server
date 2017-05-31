// @flow
import type { Context } from '../index';
import md5 from 'md5';

export const resolvers = {
    Query: {
        async redditPosts(
            root: any,
            { sub }: { sub: string },
            context: Context
        ) {
            const posts = await context.postRepository.getReddit(sub);
            const populatedPosts = await context.postRepository.populate({
                type: `reddit:${sub}`,
                posts
            });
            return {
                count: posts.length,
                posts: populatedPosts
            };
        },
        async post(root: any, { key }: { key: string }, context: Context) {
            return await context.postRepository.getByKey(key);
        }
    }
};
