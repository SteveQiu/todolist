'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
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
Log.find().sort('-date').populate('user', 'displayName').exec(function(err, templates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(templates);
		}
	});
};