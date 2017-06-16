import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import { schema as postsSchema, resolvers as postsResolvers } from './posts';
import { schema as iotSchema, resolvers as iotResolvers } from './iot';
import { schema as userSchema, resolvers as userResolvers } from './user';

const resolvers = merge(postsResolvers, iotResolvers, userResolvers);

const rootSchema = [
    `
    type Query {
        currentUser: User,
        iotConnection: IotConnection,
        post(key: String!): Post,
        redditPosts(sub: String!): PostResponse
    }
    type Subscription {
        postAdded: Post
    }
    schema {
        query: Query,
        subscription: Subscription
    }
`,
];
const executableSchema = makeExecutableSchema({
    typeDefs: [...rootSchema, ...postsSchema, ...iotSchema, ...userSchema],
    resolvers,
});

export default executableSchema;
