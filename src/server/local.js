// @flow
require('babel-core/register');
const { app } = require('./index');

app.listen(3001, () => {
    console.log('Server listening on port 3001');
});
