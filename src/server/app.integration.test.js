// @flow
import supertest from 'supertest';
import { sequelize } from '../common/models';
import { app } from './index';

const agent = supertest.agent(app);

describe('The root app', () => {
    it('should response to /status', async () => {
        const date = new Date();
        const { body } = await agent.get('/status').expect(200);
        expect(body.ok).toEqual(1);
        expect(new Date(body.date).valueOf()).toBeGreaterThan(date.valueOf());
    });
    it('should have /graphql', async () => {
        await agent.get('/graphql').expect(400);
    });
    it('should have /login/twitter enpoint', async () => {
        const { body } = await agent.get('/login/twitter').expect(302);
    });
    it('should return 404 if a link it not found', async () => {
        const { body } = await agent.get('/thisendpointdoesntexist').expect(404);
        expect(body).toEqual({ error: 'NotFound' });
    });
});
