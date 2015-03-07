'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Checklist = mongoose.model('Checklist'),
	Log = mongoose.model('Log'),
	_ = require('lodash');

function LogEntry(doc, action, itemName, user){
	this.type = 'checklist';
	this.document = doc;
	this.documentName = doc.name;
	this.action = action;
	this.itemName = itemName;
	this.user = user;
}

var enterIntoLog = function(logEntry, req, res){
	var log = new Log(logEntry);

	log.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});

	// notify every connected user about an update in the logs for the newsfeed
	var socketio = req.app.get('socketio');
	socketio.emit('log.updated', log); 	// emit an event for all connected clients
};

/**
 * Create a Checklist
 */
exports.create = function(req, res) {
	var checklist = new Checklist(req.body);
	checklist.user = req.user;

	var logEntry = new LogEntry (checklist, 'created checklist', req.body.name, req.user);
	checklist.checklistLog.push(logEntry);

	checklist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(checklist);
		}
	});

	enterIntoLog(logEntry, req, res);
};

/**
 * Show the current Checklist
 */
exports.read = function(req, res) {
	res.jsonp(req.checklist);
};

/**
 * Update a Checklist
 */
exports.update = function(req, res) {
	var checklist = req.checklist;

	checklist = _.extend(checklist , req.body);

	var logEntry = new LogEntry(checklist, req.body.action, req.body.itemName, req.user);
	checklist.checklistLog.push(logEntry);

	checklist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			// notify every connected user about an update in a checklist
			var socketio = req.app.get('socketio');
			socketio.emit('checklist.updated', checklist); 					// emit an event for all connected clients

			res.jsonp(checklist);
		}
	});

	enterIntoLog(logEntry, req, res);
};

/**
 * Archive a Checklist
 */
exports.archive = function(req, res) {
	var checklist = req.checklist;
	checklist.active = false;

	var logEntry = new LogEntry(checklist, 'deleted checklist', checklist.name, req.user);
	checklist.checklistLog.push(logEntry);

	checklist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(checklist);
		}
	});

	enterIntoLog(logEntry, req, res);
};

/**
 * List of Checklists
 */
exports.list = function(req, res) {

	Checklist.find({user: req.user, active: true}).sort('-created').populate('user', 'username').exec(function(err, checklists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(checklists);
		}
	});
};

/**
 * Checklist middleware
 */
exports.checklistByID = function(req, res, next, id) { Checklist.findById(id).populate('user', 'username').exec(function(err, checklist) {
		if (err) return next(err);
		if (! checklist) return next(new Error('Failed to load Checklist ' + id));
		req.checklist = checklist ;
		next();
	});
};

/**
 * Checklist authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.checklist.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};