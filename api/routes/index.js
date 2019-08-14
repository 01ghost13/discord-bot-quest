'use strict';

const secure      = require('../secure');
const controllers = require('../controllers');


module.exports = (express) => {

    // Get all channels
    express.get('/channels/all', secure(controllers.channels.all));

    // Say to channel
    express.post('/channels/say', secure(controllers.channels.say));

    // Get emojis from channel
    express.get('/channels/emojis', secure(controllers.channels.emojis));

};
