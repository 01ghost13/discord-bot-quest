'use strict';

const bot           = require('../../discord');
const User          = require('./user');
const ResponseError = require('../response-error');


module.exports = class Guild {
    /**
     * Get list of guilds
     *
     * @returns {[string]}
     */
    static list() {
        let guilds = [];

        bot.guilds.forEach((guild) => {
            guilds.push(guild.id);
        });

        return guilds;
    }

    /**
     * Get info about guild
     * "short == false" parameter adds fields {roles: {}, emojis: {}, members: {}, channels: {}, presences: {}}
     *
     * @param {string} guild_id
     * @param {boolean} short
     * @returns {{deleted: boolean, memberCount: number, name: string, icon: string, available: boolean, id: string,
     *            region: string, ownerID: string}}
     */
    static info(guild_id, short = true) {
        const guild = this.getById(guild_id);

        let info = {
            id:          guild.id,
            name:        guild.name,
            icon:        guild.icon,
            region:      guild.region,
            ownerID:     guild.ownerID,
            deleted:     guild.deleted,
            available:   guild.available,
            memberCount: guild.memberCount,
        };

        if (!short) {
            info['roles']     = this.roles(guild_id);
            info['emojis']    = this.emojis(guild_id);
            info['members']   = this.members(guild_id);
            info['channels']  = this.channels(guild_id);
            info['presences'] = this.presences(guild_id);
        }

        return info;
    }

    /**
     * Get guild roles
     *
     * @param {string} guild_id
     * @return {[{id: string, name: string, color: number, deleted: boolean}]}
     */
    static roles(guild_id) {
        let roles = {};

        this.getById(guild_id)
            .roles
            .forEach((role) => {
                roles[role.id] = {
                    id:      role.id,
                    name:    role.name,
                    color:   role.color,
                    deleted: role.deleted,
                };
            });

        return roles;
    }

    /**
     * Get guild emojis
     *
     * @param {string} guild_id
     * @return {[{id: string, name: string, animated: boolean, deleted: boolean}]}
     */
    static emojis(guild_id) {
        let emojis = {};

        this.getById(guild_id)
            .emojis
            .forEach((emoji) => {
                emojis[emoji.id] = {
                    id:       emoji.id,
                    name:     emoji.name,
                    deleted:  emoji.deleted,
                    animated: emoji.animated,
                };
            });

        return emojis;
    }

    /**
     * Get guild members
     *
     * @param {string} guild_id
     * @return {[{roles: Array, nickname: string, deleted: boolean,
     *            user: {id: string, bot: boolean, avatar: string, username: string, discriminator: string}}]}
     */
    static members(guild_id) {
        let members = {};

        this.getById(guild_id)
            .members
            .forEach((member) => {
                const user = User.info(member.user.id);

                members[user.id] = {
                    user:     user,
                    roles:    member._roles,
                    deleted:  member.deleted,
                    nickname: member.nickname,
                };
            });

        return members;
    }

    /**
     * Get guild channels
     *
     * @param {string} guild_id
     * @return {[{id: string, name: string, type: string, deleted: boolean, parentID: string, position: number}]}
     */
    static channels(guild_id) {
        let channels = {};

        this.getById(guild_id)
            .channels
            .forEach((channel) => {
                channels[channel.id] = {
                    id:       channel.id,
                    name:     channel.name,
                    type:     channel.type,
                    deleted:  channel.deleted,
                    parentID: channel.parentID || '',
                    position: channel.position,
                };
            });

        return channels;
    }

    /**
     * Get guild presences
     *
     * @param {string} guild_id
     * @return {[{id: string, game: *, status: string, clientStatus: {}}]}
     */
    static presences(guild_id) {
        let presences = {};

        this.getById(guild_id)
            .presences
            .forEach((presence, id) => {
                presences[id] = {
                    id:           id,
                    game:         presence.game,
                    status:       presence.status,
                    clientStatus: presence.clientStatus,
                };
            });

        return presences;
    }

    /**
     * Get guild by ID
     *
     * @param {string} id
     * @throws {ResponseError}
     * @return {*}
     */
    static getById(id) {
        const guild = bot.guilds.get(id);

        if (!guild) {
            throw new ResponseError('Guild does not exist!', 500);
        }

        return guild;
    }
};
