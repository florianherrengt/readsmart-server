// @flow
import { sequelize } from '../../common/models';
import type { SourceModel as $SourceModel } from '../../common/models';
import isUrl from 'is-url';

export type SourceRepositoryParams = {
    SourceModel: $SourceModel,
};
export class SourceRepository {
    SourceModel: $SourceModel;
    constructor(params: SourceRepositoryParams) {
        Object.assign(this, params);
    }
    async create(params: { type: string, url: string, userId: string, name: string, transaction?: any }) {
        const { url, transaction = null } = params;
        if (!isUrl(url)) {
            return new Error('url is not a valid');
        }
        return await this.SourceModel.create(params, { transaction });
    }
    async getByUserId(params: { userId: string }) {
        const { userId } = params;

        return await this.SourceModel.findAndCountAll({
            where: { userId },
        });
    }
}
