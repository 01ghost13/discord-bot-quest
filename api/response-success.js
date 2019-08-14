'use strict';

module.exports = class ResponseSuccess {
    constructor() {
        //
    }

    static send(res, data = {}) {
        res.status(200).json({
            meta: {
                status: 200
            },
            data: data
        });
    }
};
