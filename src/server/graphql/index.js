// @flow
import { GraphQlRouter } from './router';
import { Post } from '../repositories/Post';

export type Context = {
    postRepository: Post
};

export { GraphQlRouter };
