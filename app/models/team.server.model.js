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
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	members: [{
		id: { 
			type: Schema.ObjectId,
			ref:  'User'
		},
		_id: false
	}],
	checklists: [{
			type: Schema.ObjectId,
			ref:  'Checklist'
	}],
	active: {
		type: Boolean,
		default: true
	}

});

mongoose.model('Team', TeamSchema);