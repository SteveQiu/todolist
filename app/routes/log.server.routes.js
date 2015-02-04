'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var log = require('../../app/controllers/log');

	// Templates Routes
	app.route('/log')
		.get(log.list)
		.post(users.requiresLogin, log.create);
};