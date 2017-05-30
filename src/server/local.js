// @flow
require('babel-core/register');
const { app } = require('./index');

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
