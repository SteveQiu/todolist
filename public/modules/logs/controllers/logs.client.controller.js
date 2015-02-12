'use strict';

// Logs controller
angular.module('logs').controller('LogsController', ['$scope', '$stateParams', '$location', 'Socket', 'Authentication', 'Logs',
	function($scope, $stateParams, $location, Socket, Authentication, Logs ) {
		$scope.authentication = Authentication;

		// Create new Log
		$scope.create = function() {
			// Create new Log object
			var log = new Logs ({
				name: this.name
			});

			// Redirect after save
			log.$save(function(response) {
				$location.path('logs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Log
		$scope.remove = function(log) {
			if ( log ) { 
				log.$remove();

				for (var i in $scope.logs) {
					if ($scope.logs [i] === log) {
						$scope.logs.splice(i, 1);
					}
				}
			} else {
				$scope.log.$remove(function() {
					$location.path('logs');
				});
			}
		};

		// Update existing Log
		$scope.update = function() {
			var log = $scope.log;

			log.$update(function() {
				$location.path('logs/' + log._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Logs
		$scope.find = function() {
			$scope.logs = Logs.query();
		};

		// Find existing Log
		$scope.findOne = function() {
			$scope.log = Logs.get({ 
				logId: $stateParams.logId
			});
		};

		$scope.buildUrl = function(entry){
			var url = '#!/' + entry.type + 's';

			if (entry.action.indexOf('deleted') > -1){
				return url;
			}

			return url + '/' + entry.document;
		};

		var basicMessageString = function (action, itemName){
			return action + ': \"' + itemName + '\"';
		};

		$scope.buildString = function(entry){
			var action = entry.action;
			var message = basicMessageString (action, entry.itemName);

			if(action.indexOf('task') > -1){
				message += ' in ' + entry.type + ': \"' + entry.documentName + '\"';
			}

			return message;

		};

		// listening for the 'log.updated' event through the socket
	    Socket.on('log.updated', function(log) {

	   		//If this query proves to be too slow, could update this by
	   		//pushing the updated log into the $scope.logs array and splicing
	   		//the last entry. That might be faster but I think this should suffice
	   		//for now.
	    	$scope.logs = Logs.query();

		});

	}
]);