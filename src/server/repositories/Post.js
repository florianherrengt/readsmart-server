// @flow
import config from '../../../config';
// import moment from 'moment';
// import type { Moment } from 'moment';
import { redisClient } from '../../common/redis';
import { pubsub, POST_ADDED } from '../../common/pubsub';
import md5 from 'md5';

export type PostParams = {
    s3: any,
    agent: any,
    sns: any,
};

export type Post = {
    title: string,
    url: string,
    created_at?: string,
};

export class PostRepository {
    s3: any;
    agent: any;
    sns: any;
    constructor(params: PostParams) {
        Object.assign(this, params);
    }
    getByKey(Key: string) {
        return new Promise((resolve, reject) => {
            if (!config.aws || !config.aws.s3 || !config.aws.s3.postsBucket) {
                throw new Error('config.aws.s3.postsBucket is required');
            }
            this.s3.getObject(
                {
                    Bucket: config.aws.s3.postsBucket,
                    Key: `${Key}.json`,
                    ResponseContentType: 'application/json',
                },
                (error, data) => {
                    error ? reject(error) : resolve(JSON.parse(data.Body.toString()));
                },
            );
        });
    }
    async _fetch(post: Post) {
        console.log('fetching', post.url);
        const id = md5(post.url);
        console.log(post);
        const extractorUrl = config.extractorUrl || '';
        const { body } = await this.agent.get(`${extractorUrl}?url=${post.url}`);
        const textAsArray = body.text.split('. ').filter(t => t);
        body.short_text = textAsArray.reduce((result, t) => {
            if (result.length > 200) return result;
            return result + t + '\n\n';
        }, '');
        Object.assign(body, {
            id,
            text: body.text.split('. ').join('.\n\n'),
            created_at: post.created_at ? new Date(post.created_at) : new Date(),
        });
        redisClient.set(id, JSON.stringify(body));
        redisClient.expire(id, 3600 * 24 * 3);
        pubsub.publish(POST_ADDED, { [POST_ADDED]: body });
    }
    async getReddit(sub: string) {
        const postsFromCache = await redisClient.getAsync(`reddit:posts:${sub}`);
        if (postsFromCache) {
            console.log('reddit posts from cache');
            console.log(JSON.parse(postsFromCache));
            return JSON.parse(postsFromCache);
        }
        console.log('fetching reddit');
        const response = await this.agent
            .get(`https://www.reddit.com/r/${sub}.json`)
            .set('Accept', 'application/json')
            .set('User-Agent', 'readsmart-api');
        const { body: { data: { children: rawPosts } } } = response;
        const posts = rawPosts
            .filter(({ data: { distinguished } }) => distinguished !== 'moderator')
            .map(({ data: { url, title, ups, created: created_at } }) => ({ url, title, ups, created_at }))
            .filter(({ url }) => url)
            .sort(function(a, b) {
                var keyA = new Date(a.created_at), keyB = new Date(b.created_at);
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
        redisClient.set(`reddit:posts:${sub}`, JSON.stringify(posts));
        redisClient.expire('reddit:posts', 60 * 30);
        return posts;
    }
    async populate({ type, posts }: { type: string, posts: [] }) {
        const populatedPosts = await Promise.all(
            posts.map(
                ({ title, url }) =>
                    new Promise((resolve, reject) => {
                        redisClient.getAsync(`${md5(url)}`).then(post => {
                            return resolve({ ...JSON.parse(post), title, url, isLoading: !post });
                        });
                    }),
            ),
        );
        populatedPosts.filter(({ isLoading }) => isLoading).map(post => this._fetch(post));
        return populatedPosts;
    }
}
