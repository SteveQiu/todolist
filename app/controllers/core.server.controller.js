'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
//	if(req.user)
		res.render('index', {
			user: req.user || null
		});
/*	else
		res.render('signin',{
			user: req.user || null
		});*/
};