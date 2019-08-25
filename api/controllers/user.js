'use strict';

const User            = require('../actions/user');
const ResponseError   = require('../response-error');
const ResponseSuccess = require('../response-success');


module.exports = {

    // GET /user/info
    info: (req, res) => {
        ResponseSuccess.send(res, User.info(req.body.user_id));
    },

};
