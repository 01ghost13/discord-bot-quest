'use strict';

const config        = require('../config');
const ResponseError = require('./response-error');


module.exports = (handler) => {
    return (req, res) => {
        if (config.SECURE_TOKEN && req.header('Secure-Token') === config.SECURE_TOKEN) {
            handler(req, res);
        }
        else {
            throw new ResponseError('Not authorized!', 401, false);
        }
    };
};
