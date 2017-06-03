import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import { schema as postsSchema, resolvers as postsResolvers } from './posts';
import { schema as iotSchema, resolvers as iotResolvers } from './iot';

const resolvers = merge(postsResolvers, iotResolvers);

const rootSchema = [
    `
    type Query {
        iotConnection: IotConnection
        redditPosts(sub: String!): PostResponse,
        post(key: String!): Post
    }
    schema {
        query: Query
    }
`
];
const executableSchema = makeExecutableSchema({
    typeDefs: [...rootSchema, ...postsSchema, ...iotSchema],
    resolvers
});

export default executableSchema;
