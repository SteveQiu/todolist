'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var teams = require('../../app/controllers/teams.server.controller');
	// var checklists = require('../../app/controllers/checklists.server.controller');
	var notifications = require('../../app/controllers/notifications.server.controller');

	// Teams Routes
	app.route('/teams')
		.get(teams.list)
		.post(users.requiresLogin, teams.create);

	app.route('/teams/:teamId')
		.get(teams.read)
		.put(users.requiresLogin, teams.update)
		.delete(users.requiresLogin, teams.hasAuthorization, teams.archive);

	// Finish by binding the Team middleware
	app.param('teamId', teams.teamByID);
};
