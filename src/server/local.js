// @flow
require('babel-core/register');
const { app, createSubscriptionServer } = require('./index');
const models = require('../common/models');
models.sync().then(() => {
    const { createServer } = require('http');

    const server = createServer(app);

    server.listen(8000, () => {
        createSubscriptionServer(server);
        console.log('Server listening on port 8000');
    });
});
