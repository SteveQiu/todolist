'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Template = mongoose.model('Template'),
	Log = mongoose.model('Log'),
	_ = require('lodash');

function LogEntry(action, itemName, user, type, doc){
	this.type = type;
	this.document = doc;
	this.action = action;
	this.itemName = itemName;
	this.user = user;
}

var templateType = 'template';

/**
 * Create a Template
 */
exports.create = function(req, res) {
	var template = new Template(req.body);
	template.user = req.user;

	var logEntry = new LogEntry ('created template', req.body.name, req.user, templateType, template);
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

	var log = new Log(logEntry);

	log.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});

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

	var logEntryUpdate = new LogEntry(req.body.action, req.body.itemName, req.user, templateType, template);
	template.templateLog.push(logEntryUpdate);

	template.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(template);
		}
	});

	var log = new Log(logEntryUpdate);

	log.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});
};

/**
 * Archive a Template
 */
exports.archive = function(req, res) {
	var template = req.template;
	template.active = false;

	var logEntryArchive = new LogEntry('deleted template', template.name, req.user, templateType, template);
	template.templateLog.push(logEntryArchive);

	template.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(template);
		}
	});

	var log = new Log(logEntryArchive);

	log.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});	
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

