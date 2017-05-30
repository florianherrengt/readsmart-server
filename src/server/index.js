// @flow
import 'babel-polyfill';
import { App } from './app';

const app = new App({ pgPool: '' });

export { app };
