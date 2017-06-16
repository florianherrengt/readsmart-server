export type UserRepositoryParams = {
    UserModel: any,
};
export class UserRepository {
    constructor(params: UserRepositoryParams) {
        Object.assign(this, params);
    }
    getCurrentUser() {}
}
