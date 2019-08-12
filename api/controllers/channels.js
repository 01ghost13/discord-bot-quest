'use strict';

const Channels        = require('../actions/channels');
const ResponseError   = require('../response-error');
const ResponseSuccess = require('../response-success');


module.exports = {

    // Get all channels
    all: (req, res) => {
        ResponseSuccess.send(res, Channels.getAll());
    },

    // Say to channel
    say: async (req, res) => {
        try {
            await Channels.sayToChannel(req.body.channel_id, req.body.content);

            ResponseSuccess.send(res);
        }
        catch (err) {
            ResponseError.send(err, req, res);
        }
    },

};
