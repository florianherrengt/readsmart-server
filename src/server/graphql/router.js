import express, { Router } from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import * as bodyParser from 'body-parser';

import schema from './schema';

export class GraphQlRouter extends Router {
    constructor(options) {
        super(options);
        const context = {};
        this.use(
            '/graphql',
            bodyParser.urlencoded({ extended: true }),
            bodyParser.json(),
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
