// @flow
import config from '../../config';
import express, { Router } from 'express';
import type { $Application, $Request, $Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import ConnectRedis from 'connect-redis';
const RedisStore = ConnectRedis(session);

import { GraphQlRouter } from './graphql/router';

import { PassportRouter } from './passport';

import type { $repositories } from './index';

export type AppParams = {
    repositories: $repositories,
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
        this.app.use(cors({ origin: config.clientUrl, credentials: true }));
        this.app.use(
            session({
                secret: 'secret',
                resave: true,
                saveUninitialized: true,
                cookie: {
                    path: '/',
                    httpOnly: true,
                    secure: false,
                    maxAge: null,
                },
                store: new RedisStore({ url: config.redis }),
            }),
        );
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        const rootRouter = new Router();
        this.app.use('/status', new StatusRouter());
        this.app.use(new GraphQlRouter(params.repositories));
        this.app.use(new PassportRouter());
        rootRouter.all('*', (request: $Request, response: $Response) => {
            response.status(404).json({ error: 'NotFound' });
        });
        this.app.use(rootRouter);
        return this.app;
    }
}

