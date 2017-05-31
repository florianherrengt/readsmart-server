// @flow
import config from '../../../config';
import md5 from 'md5';

export type PostParams = {
    s3: any,
    agent: any
};

export class Post {
    s3: any;
    agent: any;
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
                    ResponseContentType: 'application/json'
                },
                (error, data) => {
                    error && console.log({ error });
                    error
                        ? reject(error)
                        : resolve(JSON.parse(data.Body.toString()));
                }
            );
        });
    }
    async getReddit(sub: string) {
        const response = await this.agent
            .get(`https://www.reddit.com/r/${sub}.json`)
            .set('Accept', 'application/json')
            .set('User-Agent', 'readsmart-api');
        const { body: { data: { children: rawPosts } } } = response;
        const posts = rawPosts
            .filter(
                ({ data: { distinguished } }) => distinguished !== 'moderator'
            )
            .map(({ data: { url, title, ups } }) => ({ url, title, ups }))
            .filter(({ url }) => url);
        return posts;
    }
    async populate({ type, posts }: { type: string, posts: [] }) {
        return await Promise.all(
            posts.map(
                ({ url }) =>
                    new Promise((resolve, reject) => {
                        this.getByKey(`${type}/${md5(url)}`)
                            .then(post =>
                                resolve({ ...post, isLoading: false })
                            )
                            .catch(() => resolve({ url, isLoading: true }));
                    })
            )
        );
    }
}
