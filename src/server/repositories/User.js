export type UserRepositoryParams = {
    UserModel: any,
};
export class UserRepository {
    constructor(params: UserRepositoryParams) {
        Object.assign(this, params);
    }
    async create(params: { username: string }) {
        return await this.UserModel.create(params);
    }
}
