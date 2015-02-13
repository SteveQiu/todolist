'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({
	email: {
		type: String,
		default: '',
		required: 'Please enter the email of the member',
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
	active:{
		type: Boolean,
		default: true
	}
});

mongoose.model('Notification', NotificationSchema);