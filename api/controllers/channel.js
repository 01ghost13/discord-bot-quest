'use strict';

const Channel         = require('../actions/channel');
const ResponseError   = require('../response-error');
const ResponseSuccess = require('../response-success');


module.exports = {

    // POST /channel/say
    say: async (req, res) => {
        try {
            await Channel.say(req.body.channel_id, req.body.content);

            ResponseSuccess.send(res);
        }
        catch (err) {
            ResponseError.send(err, req, res);
        }
    },

};
