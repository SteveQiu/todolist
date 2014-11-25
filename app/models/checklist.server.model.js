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
	taskList: [{
		name: { type: String, default:'', required: 'Please fill Task name', trim: true},
		isDone: { type: Boolean, default: false}
	}]
});

mongoose.model('Checklist', ChecklistSchema);