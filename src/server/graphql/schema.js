import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import { schema as postsSchema, resolvers as postsResolvers } from './posts';

const resolvers = merge(postsResolvers, {});

const executableSchema = makeExecutableSchema({
    typeDefs: [...postsSchema],
    resolvers
});

export default executableSchema;
