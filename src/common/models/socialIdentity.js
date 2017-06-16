import Sequelize from 'sequelize';

export const twitter = {
    token: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    tokenSecret: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    profile: {
        type: Sequelize.JSONB,
        allowNull: false,
    },
};
