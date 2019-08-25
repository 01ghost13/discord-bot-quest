'use strict';

const Guild           = require('../actions/guild');
const ResponseError   = require('../response-error');
const ResponseSuccess = require('../response-success');


module.exports = {

    // GET /guild/info
    info: (req, res) => {
        const short = 'short' in req.body ? req.body.short : true;

        ResponseSuccess.send(res, Guild.info(req.body.guild_id, short));
    },

    // GET /guild/roles
    roles: (req, res) => {
        ResponseSuccess.send(res, Guild.roles(req.body.guild_id));
    },

    // GET /guild/emojis
    emojis: (req, res) => {
        ResponseSuccess.send(res, Guild.emojis(req.body.guild_id));
    },

    // GET /guild/members
    members: (req, res) => {
        ResponseSuccess.send(res, Guild.members(req.body.guild_id));
    },

    // GET /guild/channels
    channels: (req, res) => {
        ResponseSuccess.send(res, Guild.channels(req.body.guild_id));
    },

    // GET /guild/presences
    presences: (req, res) => {
        ResponseSuccess.send(res, Guild.presences(req.body.guild_id));
    },

};
