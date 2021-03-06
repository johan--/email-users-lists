'use strict';

const users = require('../controllers/users.server.controller');

module.exports = (app) => {
    app.route('/users')
        .post(users.create)
        .get(users.list);

    app.route('/users/:userUuid')
        .get(users.read)
        .put(users.update)
        .delete(users.delete);

    app.param('userUuid', users.userByUuid);
};