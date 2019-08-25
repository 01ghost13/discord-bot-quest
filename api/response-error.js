'use strict';

module.exports = class ResponseError extends Error {
    constructor(message, code, console_error = true) {
        super(message);

        this.name          = 'ResponseError';
        this.code          = code;
        this.console_error = console_error;
    }

    static send(err, req, res) {
        if (err.hasOwnProperty('console_error') && err.console_error) {
            console.error('Api error!', err);
        }

        res.status(err.code).json({
            code:    err.code,
            name:    err.name,
            message: err.message
        });
    }
};
