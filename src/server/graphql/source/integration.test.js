import supertest from 'supertest';
import express from 'express';
import { repositories } from '../../index';
import { GraphQlRouter } from '../router';
import { sequelize, sync, UserModel, SourceModel } from '../../../common/models';

const graphQlRouter = new GraphQlRouter({ ...repositories });

describe('The Source graphql endpoint', () => {
    let agent;
    let user;
    beforeAll(async () => {
        await sync(true);
    });
    afterAll(async () => {
        await sequelize.close();
    });
    beforeEach(async () => {
        user = await UserModel.create({ username: 'test' }).then(user => user.toJSON());
        const testApp = express();
        testApp.use((request, response, next) => {
            request.session = { passport: { user } };
            next();
        });
        testApp.use(graphQlRouter);

        agent = supertest.agent(testApp);
    });
    it('should create the source for the logged in user', async () => {
        const { body: { data: { addSource } } } = await agent.post('/graphql').send({
            query: `mutation {
                addSource(url: "http://test.com", type: reddit, name: "test") {
                    id,
                    url,
                    type,
                    name
                }
            }`,
        });
        const createdSource = await SourceModel.findById(addSource.id).then(source => source.toJSON());
        expect(createdSource).toBeDefined();
        expect(addSource).toBeDefined();
        ['id', 'url', 'type', 'name'].forEach(key => {
            expect(createdSource[key]).toEqual(addSource[key]);
        });
    });
    it('should all the sources for the logged in user', async () => {
        const createdSource1 = await repositories.sourceRepository.create({
            type: 'reddit',
            userId: user.id,
            name: 'test1',
            url: 'http://source1.com',
        });
        const createdSource2 = await repositories.sourceRepository.create({
            type: 'medium',
            userId: user.id,
            name: 'test2',
            url: 'http://source2.com',
        });
        const { body: { data: { allSources: { count, sources } } } } = await agent.post('/graphql').send({
            query: `{
                allSources {
                    count,
                    sources {
                        id,
                        url,
                        type,
                        name
                    }
                }
            }`,
        });
        expect(count).toEqual(2);
        [('id', 'url', 'type', 'name')].forEach(key => {
            expect(createdSource1[key]).toEqual(sources[0][key]);
        });
        ['id', 'url', 'type', 'name'].forEach(key => {
            expect(createdSource2[key]).toEqual(sources[1][key]);
        });
    });
});
