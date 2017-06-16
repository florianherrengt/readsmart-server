// @flow
import 'babel-polyfill';
import { App } from './app';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import schema from './graphql/schema';
import { execute, subscribe } from 'graphql';

const app = new App({ pgPool: '' });
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

export { app, createSubscriptionServer };
