'use strict';

const fs     = require('fs');
const config = require('../config');

const { Sequelize, DataTypes } = require('sequelize');

const connection = new Sequelize(
    config.database.url,
    {
        logging:        false,
        dialect:        config.database.dialect,
        dialectOptions: config.database.dialectOptions,
    }
);


const models      = {};
const model_files = fs.readdirSync(__dirname + '/../models').filter(file => file.endsWith('.js'));

const getModelName = (file) => file.charAt(0).toUpperCase() + file.slice(1).replace('.js', '');

for (const file of model_files) {
    models[getModelName(file)] = require(__dirname + `/../models/${file}`)(connection, DataTypes);
}

module.exports = {
    connection,
    models
};
