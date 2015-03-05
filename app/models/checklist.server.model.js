'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Checklist Schema
 */
var ChecklistSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Checklist name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	team: {
		type: Schema.ObjectId,
		ref: 'Team'
	},
	taskList: [{
		name: { type: String, default:'', required: 'Please fill Task name', trim: true},
		isDone: { type: Boolean, default: false}
	}],
	active: {
		type: Boolean,
		default: true
	},
	checklistLog: [{
		action: String,
		itemName: String,
		user: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		date: {
			type: Date,
			default: Date.now
		}
	}]
});

mongoose.model('Checklist', ChecklistSchema);