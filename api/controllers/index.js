'use strict';

const fs = require('fs');


let controllers = {};

fs.readdirSync(__dirname)
    .filter(controller => controller !== 'index.js')
    .forEach(controller_file => {
        controllers[controller_file.split('.')[0]] = require(`${__dirname}/${controller_file}`);
    });


module.exports = controllers;
