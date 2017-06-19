// @flow
import { Router } from 'express';
import type { $Request, $Response } from 'express-session';
import type { Context } from './index';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import schema from './schema';

import { PostRepository, UserRepository, SourceRepository } from '../repositories';

export type GraphQlRouterParams = {
    postRepository: PostRepository,
    userRepository: UserRepository,
    sourceRepository: SourceRepository,
};

export class GraphQlRouter {
    constructor({ postRepository, userRepository, sourceRepository }: GraphQlRouterParams) {
        const router = new Router();

        router.use(bodyParser.urlencoded({ extended: true }), bodyParser.json());

        router.use('/graphql', (request: $Request, response: $Response) => {
            const context: Context = {
                postRepository,
                userRepository,
                sourceRepository,
                session: request.session,
            };
            return graphqlExpress({
                schema,
                context,
                formatError: error => {
                    return {
                        message: error.message,
                        stack: error.stack.split('\n'),
                    };
                },
            })(request, response);
        });

        router.use(
            '/graphiql',
            graphiqlExpress({
                endpointURL: '/graphql',
            }),
        );
        return router;
    }
}
