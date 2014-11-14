'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Template Schema
 */
var TemplateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Template name',
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
	taskList: [{type: String}]
});

mongoose.model('Template', TemplateSchema);