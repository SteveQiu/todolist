'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Log Schema
 */
var LogSchema = new Schema({
	type: {
		type: String,
		enum: ['template', 'checklist']
	},
	document: {
		type: Schema.ObjectId,
	},
	action: {
		type: String
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