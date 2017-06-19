import Sequelize from 'sequelize';
import config from '../../../config';

const sequelize = new Sequelize(config.postgres, { logging: false });

const UserModel = sequelize.define('user', require('./user').default, {
    timestamps: true,
    pool: {
        max: process.env.NODE_ENV === 'production' ? 1 : Number.MAX_SAFE_INTEGER,
        min: 0,
        idle: 10000,
    },
});
const TwitterIdentityModel = sequelize.define('twitterIdentity', require('./socialIdentity').twitter, {
    timestamps: true,
});
const SourceModel = sequelize.define('source', require('./source').default, { timestamps: true });

TwitterIdentityModel.belongsTo(UserModel);
SourceModel.belongsTo(UserModel);

UserModel.hasMany(TwitterIdentityModel);
UserModel.hasMany(SourceModel);

export const sync = async (force = true) => {
    await sequelize.authenticate();
    await Promise.all([UserModel, TwitterIdentityModel, SourceModel].map(model => model.sync({ force })));
    console.log('model synced');
};

export { sequelize, UserModel, TwitterIdentityModel, SourceModel };
