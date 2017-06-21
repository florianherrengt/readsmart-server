// @flow
import md5 from 'md5';
import { POST_ADDED } from '../../common/pubsub';
import { PostRepository } from './Post';
import redditMockResponse from './reddit.mock.response.json';

describe('The Post repository', () => {
    it('should return from redis if in cache', async () => {
        const cachedPosts = [{ id: 1 }];
        const agent = {};
        const redisClient = {
            getAsync: jest.fn(key => {
                expect(key).toEqual('reddit:posts:test');
                return Promise.resolve(JSON.stringify(cachedPosts));
            }),
        };
        // $FlowFixMe
        const postRepository = new PostRepository({
            agent,
            redisClient,
            pubsub: {},
        });
        const results = await postRepository.getReddit('test');
        expect(results).toEqual(cachedPosts);
        expect(redisClient.getAsync).toHaveBeenCalledTimes(1);
    });
    it('should fetch reddit if not cached and cache it with expiration', async () => {
        const fetch = () =>
            Promise.resolve({
                json: () => Promise.resolve(redditMockResponse),
            });
        const redisClient = {
            getAsync: jest.fn(key => {
                expect(key).toEqual('reddit:posts:test');
                return Promise.resolve(null);
            }),
            set: jest.fn(),
        };
        const postRepository = new PostRepository({
            fetch,
            redisClient,
            pubsub: {},
        });
        const results = await postRepository.getReddit('test');

        results.forEach(result => {
            ['id', 'url', 'title'].forEach(key => {
                expect(result[key]).toBeDefined();
            });
        });
        expect(redisClient.getAsync).toHaveBeenCalledTimes(1);
        expect(redisClient.set).toHaveBeenCalledTimes(1);
        expect(redisClient.set).toBeCalledWith('reddit:posts:test', JSON.stringify(results), 'EX', 60 * 30);
    });
    it('should populate post from cache or fetch', async () => {
        const cachedPost = {
            title: 'cached',
            url: 'http://cached.com',
        };
        const notCachedPost = {
            title: 'not cached',
            url: 'http://notcached.com',
        };
        const fetch = () => null;
        const redisClient = {
            getAsync: jest.fn(key => Promise.resolve(key === md5(cachedPost.url) && JSON.stringify(cachedPost))),
        };
        const postRepository = new PostRepository({
            fetch,
            redisClient,
            pubsub: {},
        });
        // $FlowFixMe
        postRepository._fetch = jest.fn();
        const posts = [cachedPost, notCachedPost];
        const results = await postRepository.populate({ type: 'test', posts });
        expect(results.find(({ title }) => title === cachedPost.title)).toEqual({
            ...cachedPost,
            id: md5(cachedPost.url),
            isLoading: false,
        });
        expect(results.find(({ title }) => title === notCachedPost.title)).toEqual({
            ...notCachedPost,
            id: md5(notCachedPost.url),
            isLoading: true,
        });
        expect(results.length).toEqual(2);
        expect(postRepository._fetch).toHaveBeenCalledTimes(1);
        expect(postRepository._fetch).toBeCalledWith({
            ...notCachedPost,
            id: md5(notCachedPost.url),
            isLoading: true,
        });
    });
    it.only('should fetch and publish the new post', async () => {
        const post = {
            title: 'not cached',
            url: 'http://notcached.com',
        };
        const extractorResponse = {
            text: 'this is a test.',
        };
        const fetch = () =>
            Promise.resolve({
                json: () => Promise.resolve(extractorResponse),
            });
        const redisClient = {
            set: jest.fn(),
        };
        const pubsub = {
            publish: jest.fn(),
        };
        const postRepository = new PostRepository({ fetch, redisClient, pubsub });
        await postRepository._fetch(post);
        expect(pubsub.publish).toHaveBeenCalledTimes(1);
        expect(pubsub.publish.mock.calls[0][0]).toEqual(POST_ADDED);
        const { postAdded } = pubsub.publish.mock.calls[0][1];
        expect(JSON.stringify(postAdded.text)).toEqual(`\"this is a test.\\n\\n\"`);
        expect(postAdded.text).toEqual(extractorResponse.text);
    });
});
