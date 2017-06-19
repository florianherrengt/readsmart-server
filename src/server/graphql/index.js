// @flow
import { GraphQlRouter } from './router';
import { PostRepository, UserRepository, SourceRepository } from '../repositories';

export type Context = {
    postRepository: PostRepository,
    userRepository: UserRepository,
    sourceRepository: SourceRepository,
    session: {
        passport: {
            user: {
                id: string,
                username: string,
            },
        },
    },
};

export { GraphQlRouter };
