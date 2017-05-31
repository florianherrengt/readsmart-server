// @flow
import express, { Router } from 'express';
import type { RouterOptions } from 'express';
import type { Context } from './index';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import agent from 'superagent';
import config from '../../../config';
import schema from './schema';
import { s3 } from '../../common/aws';

import { Post as PostRepository } from '../repositories/Post';
const postRepository = new PostRepository({ s3, agent });

export class GraphQlRouter extends Router {
    constructor(options?: RouterOptions) {
        super(options);

        const context: Context = {
            postRepository
        };

        this.use(bodyParser.urlencoded({ extended: true }), bodyParser.json());

        this.use(
            '/graphql',
            graphqlExpress({
                schema,
                context
            })
        );

        this.use(
            '/graphiql',
            graphiqlExpress({
                endpointURL: '/graphql'
            })
        );
    }
}
