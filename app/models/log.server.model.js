'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var cTempl = 'created template';
var dTempl = 'deleted template';
var cTask = 'created task';
var uTask = 'updated task';
var rTask = 'removed task';

var cCheck = 'created checklist';
var dCheck = 'deleted checklist';
var comTask = 'completed task';
var unTask = 'unchecked task';

/**
 * Log Schema
 */
var LogSchema = new Schema({
	type: {
		type: String,
		enum: ['template', 'checklist', 'team'],
		lowercase: true
	},
	document: {
		type: Schema.ObjectId,
	},
	documentName: {
		type: String
	},
	action: {
		type: String,
		enum: [cTempl, dTempl, cTask, uTask, rTask, cCheck, dCheck, comTask, unTask],
		lowercase: true
	},
	itemName: {
		type: String
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Log', LogSchema);