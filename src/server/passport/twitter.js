// @flow
import config from '../../../config';
import { Strategy } from 'passport-twitter';

export type TwitterStrategyParams = { sequelize: any, UserModel: any, TwitterIdentityModel: any };

export class TwitterStrategy extends Strategy {
    constructor({ sequelize, UserModel, TwitterIdentityModel }: TwitterStrategyParams) {
        super(
            {
                consumerKey: config.twitter ? config.twitter.key : '',
                consumerSecret: config.twitter ? config.twitter.secret : '',
                callbackURL: `${config.apiUrl}/login/twitter/callback`,
            },
            async (token, tokenSecret, profile, done) => {
                try {
                    const identity = await TwitterIdentityModel.findById(token);
                    if (identity) {
                        return done(null, await identity.getUser());
                    }

                    sequelize.transaction(async transaction => {
                        const createdUser = await UserModel.create(
                            {
                                username: profile.username,
                                token,
                                tokenSecret,
                            },
                            { transaction },
                        );
                        await TwitterIdentityModel.create(
                            {
                                token,
                                tokenSecret,
                                profile,
                                userId: createdUser.toJSON().id,
                            },
                            { transaction },
                        );
                        done(null, createdUser.toJSON());
                    });
                } catch (error) {
                    done(error);
                }
            },
        );
    }
}
