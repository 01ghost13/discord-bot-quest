'use strict';

module.exports = class ResponseError extends Error {
    constructor(message, code) {
        super(message);

        this.name = 'ResponseError';
        this.code = code;
    }

    static send(err, req, res) {
        console.error('Api error!', err);

        res.status(err.code).json({ error: /*err.name + ': ' + */err.message });
    }
};
