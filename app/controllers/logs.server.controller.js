'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Log = mongoose.model('Log'),
	_ = require('lodash');

/**
 * Create a Log
 */
exports.create = function(req, res) {
	var log = new Log(req.body);

	log.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(log);
		}
	});
};

/**
 * Show the current Log
 */
exports.read = function(req, res) {
	res.jsonp(req.log);
};

/**
 * Update a Log
 */
exports.update = function(req, res) {
	var log = req.log ;

	log = _.extend(log , req.body);

	log.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(log);
		}
	});
};

/**
 * Delete an Log
 */
exports.delete = function(req, res) {
	var log = req.log ;

	log.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(log);
		}
	});
};

/**
 * List of Logs
 */
exports.list = function(req, res) { 
	Log.find().sort('-date').populate('user', 'username').exec(function(err, logs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logs);
		}
	});
};

/**
 * Return 5 logs
 */
exports.listNewsfeed = function(req, res) { 
	Log.find().sort('-date').limit(5).populate('user', 'username').exec(function(err, logs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logs);
		}
	});
};

/**
 * Log middleware
 */
exports.logByID = function(req, res, next, id) { 
	Log.findById(id).populate('user', 'username').exec(function(err, log) {
		if (err) return next(err);
		if (! log) return next(new Error('Failed to load Log ' + id));
		req.log = log ;
		next();
	});
};

/**
 * Log authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.log.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
