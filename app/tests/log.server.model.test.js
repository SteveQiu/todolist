'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Log = mongoose.model('Log');

/**
 * Globals
 */
var user, log;

/**
 * Unit tests
 */
describe('Log Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			log = new Log({
				action: 'Log Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return log.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			log.action = '';

			return log.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Log.remove().exec();
		User.remove().exec();

		done();
	});
});