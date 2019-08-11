'use strict';

const Channels      = require('../actions/channels');
const ResponseError = require('../response-error');


module.exports = {

    // Get all channels
    all: (req, res) => {
        res.json(
            Channels.getAll()
        );
    },

    // Say to channel
    say: async (req, res) => {
        try {
            await Channels.sayToChannel(req.body.channel_id, req.body.content);
        }
        catch (err) {
            ResponseError.send(err, req, res);
        }

        res.json();
    },

};
