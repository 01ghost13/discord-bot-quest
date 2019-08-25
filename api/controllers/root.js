'use strict';

const Guild           = require('../actions/guild');
const ResponseError   = require('../response-error');
const ResponseSuccess = require('../response-success');


module.exports = {

    // GET /guilds
    guilds: (req, res) => {
        ResponseSuccess.send(res, Guild.list());
    },

};
