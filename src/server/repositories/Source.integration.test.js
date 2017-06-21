// @flow
import { sequelize, SourceModel, UserModel, sync } from '../../common/models';
import { SourceRepository, UserRepository } from './index';

const sourceRepository = new SourceRepository({ SourceModel });
const userRepository = new UserRepository({ UserModel });

describe('The SourceRepository', () => {
    beforeAll(async () => {
        await sync(true);
    });
    afterAll(async () => {
        await sequelize.close();
    });
    describe('when adding source', () => {
        it('should have a userId', async () => {
            const name = 'a';
            const url = 'http://hello.com';
            const type = 'reddit';
            const userId = null;
            try {
                const source = await sourceRepository.create({
                    url,
                    type,
                    userId,
                    name,
                });
                expect(source).toBeUndefined();
            } catch (error) {
                expect(error).not.toBeUndefined();
            }
        });
        it('should reject without existing userId', async () => {
            const url = 'http://hello.com';
            const type = 'reddit';
            const userId = 'abc';
            const name = 'a';

            try {
                const source = await sourceRepository.create({
                    url,
                    type,
                    userId,
                    name,
                });
                expect(source).toBeUndefined();
            } catch (error) {
                expect(error).not.toBeUndefined();
            }
        });
        it('should create the source for existing userId', async () => {
            const url = 'http://hello.com';
            const type = 'reddit';
            const createdUser = await userRepository.create({ username: 'test' });
            const userId = createdUser.get('id');
            const name = 'asd';

            const source = await sourceRepository.create({ url, type, userId, name });
            expect(source.get('id')).toBeDefined();
            expect(source.get('name')).toEqual(name);
            expect(source.get('userId')).toEqual(userId);
        });
    });
});
