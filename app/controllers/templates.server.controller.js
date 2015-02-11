'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Template = mongoose.model('Template'),
	Log = mongoose.model('Log'),
	_ = require('lodash');

var enterIntoLog = function(logEntry, response){
	var log = new Log(logEntry);

	log.save(function(err) {
		if (err) {
			return response.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});
};

function LogEntry(doc, action, itemName, user){
	this.type = 'template';
	this.document = doc;
	this.documentName = doc.name;
	this.action = action;
	this.itemName = itemName;
	this.user = user;
}

/**
 * Create a Template
 */
exports.create = function(req, res) {
	var template = new Template(req.body);
	template.user = req.user;

	var logEntry = new LogEntry (template, 'created template', req.body.name, req.user);
	template.templateLog.push(logEntry);

	template.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(template);
		}
	});

	enterIntoLog(logEntry, res);

};

/**
 * Show the current Template
 */
exports.read = function(req, res) {
	res.jsonp(req.template);
};

/**
 * Update a Template
 */
exports.update = function(req, res) {
	var template = req.template;

	template = _.extend(template , req.body);

	var logEntry = new LogEntry(template, req.body.action, req.body.itemName, req.user);
	template.templateLog.push(logEntry);

	template.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(template);
		}
	});

	enterIntoLog(logEntry, res);
};

/**
 * Archive a Template
 */
exports.archive = function(req, res) {
	var template = req.template;
	template.active = false;

	var logEntry = new LogEntry(template, 'deleted template', template.name, req.user);
	template.templateLog.push(logEntry);

	template.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(template);
		}
	});

	enterIntoLog(logEntry, res);	
};

/**
 * List of Templates
 */
exports.list = function(req, res) { Template.find({user: req.user, active: true}).sort('-created').populate('user', 'displayName').exec(function(err, templates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(templates);
		}
	});
};

/**
 * Template middleware
 */
exports.templateByID = function(req, res, next, id) { Template.findById(id).populate('user', 'displayName').exec(function(err, template) {
		if (err) return next(err);
		if (! template) return next(new Error('Failed to load Template ' + id));
		req.template = template ;
		next();
	});
};

/**
 * Template authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.template.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

