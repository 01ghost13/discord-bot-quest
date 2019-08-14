'use strict';

const express       = require('express');
const api           = express();
const ResponseError = require('./response-error');


api.use(express.json());

require('./routes')(api);

api.use((err, req, res, next) => {
    ResponseError.send(err, req, res);
});


module.exports = api;
