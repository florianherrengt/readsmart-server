// @flow
require('babel-core/register');
const { app } = require('./index');

app.listen(8000, () => {
    console.log('Server listening on port 8000');
});
