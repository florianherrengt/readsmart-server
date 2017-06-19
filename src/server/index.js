// @flow
import 'babel-polyfill';
import { App } from './app';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import schema from './graphql/schema';
import { execute, subscribe } from 'graphql';

import agent from 'superagent';

import { sequelize, SourceModel, TwitterIdentityModel, UserModel, sync } from '../common/models';

import { redisClient } from '../common/redis';

import { UserRepository, PostRepository, SourceRepository } from './repositories';

export type $repositories = {
    postRepository: PostRepository,
    userRepository: UserRepository,
    sourceRepository: SourceRepository,
};

export const repositories = {
    postRepository: new PostRepository({ redisClient, agent }),
    userRepository: new UserRepository({ UserModel }),
    sourceRepository: new SourceRepository({ SourceModel }),
};
const app = new App({ repositories });
const createSubscriptionServer = (server: any) => {
    return new SubscriptionServer(
        {
            execute,
            subscribe,
            schema,
            onConnect: (connectionParams, webSocket) => {
                console.log(connectionParams);
                return { connectionParams };
            },
        },
        {
            server,
            path: '/subscriptions',
        },
    );
};

process.on('beforeExit', async code => {
    await sequelize.close();
    console.log('db connection closed');
});

export { app, createSubscriptionServer };
