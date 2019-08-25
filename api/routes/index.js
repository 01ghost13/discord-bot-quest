'use strict';

const secure      = require('../secure');
const controllers = require('../controllers');


module.exports = (express) => {

    /*
    |--------------------------------------------------------------------------
    | Root routes
    |--------------------------------------------------------------------------
    */

    // Get list of guilds
    express.get('/guilds', secure(controllers.root.guilds));




    /*
    |--------------------------------------------------------------------------
    | Channel routes
    |--------------------------------------------------------------------------
    */

    // Say to channel
    express.post('/channel/say', secure(controllers.channel.say));




    /*
    |--------------------------------------------------------------------------
    | Guild routes
    |--------------------------------------------------------------------------
    */

    // Get info about guild
    express.get('/guild/info', secure(controllers.guild.info));

    // Get guild roles
    express.get('/guild/roles', secure(controllers.guild.roles));

    // Get guild emojis
    express.get('/guild/emojis', secure(controllers.guild.emojis));

    // Get guild members
    express.get('/guild/members', secure(controllers.guild.members));

    // Get guild channels
    express.get('/guild/channels', secure(controllers.guild.channels));

    // Get present in the guild
    express.get('/guild/presences', secure(controllers.guild.presences));




    /*
    |--------------------------------------------------------------------------
    | Channel routes
    |--------------------------------------------------------------------------
    */

    // Get info about guild
    express.get('/user/info', secure(controllers.user.info));

};
