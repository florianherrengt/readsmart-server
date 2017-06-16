import Sequelize from 'sequelize';
import config from '../../../config';

const sequelize = new Sequelize(config.postgres);

const UserModel = sequelize.define('user', require('./user').default, { timestamps: true });
const TwitterIdentityModel = sequelize.define('TwitterIdentity', require('./socialIdentity').twitter, {
    timestamps: true,
});

TwitterIdentityModel.belongsTo(UserModel);

(async () => {
    try {
        const force = false;
        await sequelize.authenticate();
        await Promise.all([UserModel.sync({ force }), TwitterIdentityModel.sync({ force })]);
        console.info('Database ready');
    } catch (error) {
        throw new Error(error);
    }
})();

export { sequelize, UserModel, TwitterIdentityModel };
