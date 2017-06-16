export const defaultEnv = {
    extractorUrl: 'https://dj96a3dxm6.execute-api.us-east-1.amazonaws.com/prod',
    aws: {
        region: process.env.REGION || 'eu-west-2',
        apiVersions: {
            lambda: '2015-03-31',
            s3: '2006-03-01',
            sns: '2010-03-31',
        },
        s3: {
            postsBucket: process.env.POSTS_BUCKET || 'readsmart-dev-posts',
        },
        sns: {
            topics: {
                populatePostsTopic: process.env.POPULATE_POSTS_TOPIC || 'dev-populate-posts',
            },
        },
    },
    twitter: {
        key: process.env.TWITTER_KEY,
        secret: process.env.TWITTER_SECRET,
    },
};
