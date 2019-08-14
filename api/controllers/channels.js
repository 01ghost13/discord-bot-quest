'use strict';

const Channels        = require('../actions/channels');
const ResponseError   = require('../response-error');
const ResponseSuccess = require('../response-success');


module.exports = {

    // GET /channels/all
    all: (req, res) => {
        ResponseSuccess.send(res, Channels.getAll());
    },

    // POST /channels/say
    say: async (req, res) => {
        try {
            await Channels.sayToChannel(req.body.channel_id, req.body.content);

            ResponseSuccess.send(res);
        }
        catch (err) {
            ResponseError.send(err, req, res);
        }
    },

    // GET /channels/emojis
    emojis: (req, res) => {
        ResponseSuccess.send(res, Channels.getChannelEmojis(req.body.channel_id));
    },

};
