// @flow
import { GraphQlRouter } from './router';
import { PostRepository } from '../repositories/Post';
import { UserRepositoty } from '../repositories/User';

export type Context = {
    postRepository: PostRepository,
    userRepository: UserRepositoty,
    session: {
        passport?: {
            user: {
                username: string,
            },
        },
    },
};

export { GraphQlRouter };
