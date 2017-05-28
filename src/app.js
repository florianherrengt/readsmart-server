// @flow
import express, { Router } from 'express';
import type { $Application, $Request, $Response } from 'express';
export type AppParams = {
    pgPool: any
};

export class App {
    app: $Application;
    constructor(params: AppParams) {
        this.app = express();
        const apiRouter = new Router();
        apiRouter.get('/', (request: $Request, response: $Response) => {
            response.json({ ok: 1 });
        });
        const rootRouter = new Router();
        rootRouter.all('*', (request: $Request, response: $Response) => {
            response.status(404).json({ error: 'NotFound' });
        });
        this.app.use('/api', apiRouter);
        this.app.use(rootRouter);
        return this.app;
    }
}
