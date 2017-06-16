// @flow
import express, { Router } from 'express';
import type { RouterOptions, $Request, $Response } from 'express';
import passport from 'passport';
import { sequelize, UserModel, TwitterIdentityModel } from '../../common/models';
import { TwitterStrategy } from './twitter';
import config from '../../../config';

passport.use(new TwitterStrategy({ sequelize, UserModel, TwitterIdentityModel }));
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

export class PassportRouter {
    constructor(options?: RouterOptions) {
        const router = new Router(options);
        router.get('/login/twitter', passport.authenticate('twitter'));
        router.get(
            '/login/twitter/callback',
            passport.authenticate('twitter', { failureRedirect: '/login' }),
            (request: $Request, response: $Response) => {
                response.redirect(config.clientUrl);
            },
        );
        return router;
    }
}
