// @flow
import config from '../../../config';
import nodeFetch from 'node-fetch';
import { redisClient as $redisClient } from '../../common/redis';
import { PubSub } from 'graphql-subscriptions';
import { POST_ADDED } from '../../common/pubsub';
import md5 from 'md5';

export type PostParams = {
    redisClient: $redisClient,
    fetch: nodeFetch,
    pubsub: PubSub,
};

export type Post = {
    title: string,
    url: string,
    created_at?: string,
};

export class PostRepository {
    redisClient: $redisClient;
    fetch: nodeFetch;
    pubsub: PubSub;
    constructor(params: PostParams) {
        Object.assign(this, params);
    }
    async _fetch(post: Post) {
        const id = md5(post.url);
        const extractorUrl = config.extractorUrl || '';
        const response = await this.fetch(`${extractorUrl}?url=${post.url}`, {
            headers: {
                Accept: 'application/json',
            },
        }).then(response => response.json());
        const textAsArray = response.text.split('. ').filter(t => t);
        response.short_text = textAsArray.reduce((result, t) => {
            if (result.length > 200) return result;
            return result + t + '\n\n';
        }, '');
        response.text += '\n\n';
        Object.assign(response, {
            id,
            text: response.text.split('. ').join('.\n\n'),
            created_at: post.created_at ? new Date(post.created_at) : new Date(),
        });
        this.redisClient.set(id, JSON.stringify(response), 'EX', 3600 * 24 * 3);
        // this.redisClient.expire(id, 3600 * 24 * 3);
        this.pubsub.publish(POST_ADDED, { [POST_ADDED]: response });
    }
    async getReddit(sub: string) {
        const postsFromCache = await this.redisClient.getAsync(`reddit:posts:${sub}`);
        if (postsFromCache) {
            return JSON.parse(postsFromCache);
        }
        console.log('fetching reddit');
        const response = await this.fetch(`https://www.reddit.com/r/${sub}.json`, {
            headers: {
                Accept: 'application/json',
                'User-Agent': 'readsmart-api',
            },
        }).then(response => response.json());
        const { data: { children: rawPosts } } = response;
        const posts = rawPosts
            .filter(({ data: { distinguished } }) => distinguished !== 'moderator')
            .map(({ data: { url, title, ups, created: created_at } }) => ({
                id: md5(url),
                url,
                title,
                ups,
                created_at,
            }))
            .filter(({ url }) => url);
        this.redisClient.set(`reddit:posts:${sub}`, JSON.stringify(posts), 'EX', 60 * 30);
        return posts;
    }
    async populate({ type, posts }: { type: string, posts: any[] }) {
        const populatedPosts = await Promise.all(
            posts.map(({ title, url }) =>
                this.redisClient
                    .getAsync(`${md5(url)}`)
                    .then(post => ({ ...JSON.parse(post), id: md5(url), title, url, isLoading: !post })),
            ),
        );
        populatedPosts.filter(({ isLoading }) => isLoading).map(post => this._fetch(post));
        return populatedPosts;
    }
}
