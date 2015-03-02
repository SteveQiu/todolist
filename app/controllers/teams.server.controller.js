'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Team = mongoose.model('Team'),
	Notification = mongoose.model('Notification'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Team
 */
exports.create = function(req, res) {
	var team = new Team(req.body);
	console.log('trying to save team');
	team.user = req.user;

	team.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(team);
		}
	});
};

/**
 * Show the current Team
 */
exports.read = function(req, res) {
	res.jsonp(req.team);
};

/**
 * Update a Team
 */
exports.update = function(req, res) {
	var team = req.team ;

	team = _.extend(team , req.body);

	team.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(team);
		}
	});
};

/**
 * Delete an Team
 */
exports.delete = function(req, res) {
	var team = req.team ;

	team.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(team);
		}
	});
};

/**
 * Archive an Team
 */
exports.archive = function(req, res) {
	var team = req.team ;
	team.active = false;

	team.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(team);
		}
	});
};

/**
 * List of Teams
 */
exports.list = function(req, res) { 
	//$contains : {id: req.user._id} 
	console.log(req.user);
	Team.find({$or: [{user:req.user, active: true},{ members: {$elemMatch: {id: req.user._id} } } ]}).sort('-created').populate('user', 'username').populate('members.id','username email').exec(function(err, teams) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teams);
		}
	});
};

/**
 * Team middleware
 */
exports.teamByID = function(req, res, next, id) { 
	Team.findById(id).populate('user', 'username').populate('members.id','username email').exec(function(err, team) {
		if (err) return next(err);
		if (! team) return next(new Error('Failed to load Team ' + id));
		req.team = team ;
		next();
	});
};

/**
 * Team authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.team.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
