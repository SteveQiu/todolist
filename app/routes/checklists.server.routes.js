'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var checklists = require('../../app/controllers/checklists');
	var templates = require('../../app/controllers/templates');

	// Checklists Routes
	app.route('/checklists')
		.get(checklists.list)
		.post(users.requiresLogin, checklists.create);

	app.route('/checklists/:checklistId')
		.get(checklists.read)
		.put(users.requiresLogin, checklists.hasAuthorization, checklists.update)
		.delete(users.requiresLogin, checklists.hasAuthorization, checklists.archive);

	// Finish by binding the Checklist middleware
	app.param('checklistId', checklists.checklistByID);
};