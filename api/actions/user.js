'use strict';

const bot           = require('../../discord');
const ResponseError = require('../response-error');


module.exports = class User {
    /**
     * Get info about user
     *
     * @param {string} user_id
     * @return {{id: string, bot: boolean, avatar: string, username: string, discriminator: string}}
     */
    static info(user_id) {
        const user = this.getById(user_id);

        return {
            id:            user.id,
            bot:           user.bot,
            avatar:        user.avatar,
            username:      user.username,
            discriminator: user.discriminator,
        };
    }

    /**
     * Get user by ID
     *
     * @param {string} id
     * @throws {ResponseError}
     * @return {*}
     */
    static getById(id) {
        const user = bot.users.get(id);

        if (!user) {
            throw new ResponseError('User does not exist!', 500);
        }

        return user;
    }
};
