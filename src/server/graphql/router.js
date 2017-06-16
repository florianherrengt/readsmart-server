// @flow
import express, { Router } from 'express';
import type { RouterOptions, $Request, $Response } from 'express';
import type { Context } from './index';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import agent from 'superagent';
import config from '../../../config';
import schema from './schema';
import { s3, sns } from '../../common/aws';

import { UserModel } from '../../common/models';

import { PostRepository } from '../repositories/Post';
import { UserRepository } from '../repositories/User';
const postRepository = new PostRepository({ s3, agent, sns });
const userRepository = new UserRepository({ UserModel });

export class GraphQlRouter extends Router {
    constructor(options?: RouterOptions) {
        super(options);

        this.use(bodyParser.urlencoded({ extended: true }), bodyParser.json());

        this.use('/graphql', (request: $Request, response: $Response) => {
            const context: Context = {
                postRepository,
                userRepository,
                // $FlowFixMe
                session: request.session || {},
            };
            return graphqlExpress({
                schema,
                context,
            })(request, response);
        });

        this.use(
            '/graphiql',
            graphiqlExpress({
                endpointURL: '/graphql',
            }),
        );
    }
}
