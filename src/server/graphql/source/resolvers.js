// @flow
import type { Context } from '../index';

export const resolvers = {
    Query: {
        async allSources(root: any, args: any, context: Context) {
            const passport = context.session.passport || {};
            const { id: userId } = passport.user || { id: null };
            if (!userId) {
                return {
                    count: 2,
                    sources: [
                        {
                            id: Math.random(),
                            type: 'reddit',
                            name: 'news',
                            url: 'https://www.reddit.com/r/news/',
                        },
                        {
                            id: Math.random(),
                            type: 'reddit',
                            name: 'jokes',
                            url: 'https://www.reddit.com/r/jokes/',
                        },
                    ],
                };
            }
            const { count, rows: sources } = await context.sourceRepository.getByUserId({
                userId,
            });

            return { count, sources };
        },
    },
    Mutation: {
        async addSource(root: any, args: { url: string, type: string, name: string }, context: Context) {
            const userId = context.session.passport.user.id;
            return await context.sourceRepository.create({ userId, ...args });
        },
    },
};
