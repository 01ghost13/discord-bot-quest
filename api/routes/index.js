'use strict';

const secure      = require('../secure');
const controllers = require('../controllers');


module.exports = (express) => {

    // Get all channels
    express.post('/channels/all', secure(controllers.channels.all));

    // Say to channel
    express.post('/channels/say', secure(controllers.channels.say));

};
