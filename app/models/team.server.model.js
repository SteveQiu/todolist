'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Team Schema
 */
var TeamSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Team name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}

	/*
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	taskList: [{
		name: { type: String, default:'', required: 'Please fill Task name', trim: true},
		isDone: { type: Boolean, default: false}
	}],
	active: {
		type: Boolean,
		default: true
	}
	*/
	
});

mongoose.model('Team', TeamSchema);