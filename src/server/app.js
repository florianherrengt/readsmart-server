// @flow
import express, { Router } from 'express';
import type { $Application, $Request, $Response } from 'express';
import cors from 'cors';

import { GraphQlRouter } from './graphql/router';

export type AppParams = {
    pgPool: any
};

class StatusRouter extends Router {
    constructor(options) {
        super(options);
        this.get('/', (request: $Request, response: $Response) => {
            response.json({ ok: 1, date: new Date() });
        });
    }
}

export class App {
    app: $Application;
    constructor(params: AppParams) {
        this.app = express();
        this.app.use(cors());
        const apiRouter = new Router();
        apiRouter.get('/', (request: $Request, response: $Response) => {
            response.json({ ok: 1 });
        });
        const rootRouter = new Router();
        rootRouter.all('*', (request: $Request, response: $Response) => {
            response.status(404).json({ error: 'NotFound' });
        });
        this.app.use('/api', apiRouter);
        this.app.use('/status', new StatusRouter());
        this.app.use(new GraphQlRouter());
        this.app.use(rootRouter);
        return this.app;
    }
}
