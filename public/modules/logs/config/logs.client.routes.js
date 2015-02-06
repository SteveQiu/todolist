'use strict';

//Setting up route
angular.module('logs').config(['$stateProvider',
	function($stateProvider) {
		// Logs state routing
		$stateProvider.
		state('listLogs', {
			url: '/logs',
			templateUrl: 'modules/logs/views/list-logs.client.view.html'
		});
	}
]);