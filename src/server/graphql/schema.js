import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import { schema as postsSchema, resolvers as postsResolvers } from './posts';
import { schema as iotSchema, resolvers as iotResolvers } from './iot';
import { schema as userSchema, resolvers as userResolvers } from './user';
import { schema as sourceSchema, resolvers as sourceResolvers } from './source';

const resolvers = merge(postsResolvers, iotResolvers, userResolvers, sourceResolvers);

const rootSchema = [
    `
    type Query {
        currentUser: User
        iotConnection: IotConnection
        post(key: String!): Post
        redditPosts(sub: String!): PostResponse
        allSources: AllSourcesResponse
    }
    type Mutation {
        addSource(url: String!, type: SourceType!, name: String!): Source
    }
    type Subscription {
        postAdded: Post
    }
    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }
`,
];
const executableSchema = makeExecutableSchema({
    typeDefs: [...rootSchema, ...postsSchema, ...iotSchema, ...userSchema, ...sourceSchema],
    resolvers,
});

export default executableSchema;
