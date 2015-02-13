'use strict';

// Notifications controller
angular.module('notifications').controller('NotificationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notifications', 'Teams',
	function($scope, $stateParams, $location, Authentication, Notifications, Teams) {
		$scope.authentication = Authentication;

		// Create new Notification
		$scope.create = function() {
			// Create new Notification object
			var notification = new Notifications ({
				name: this.name
			});

			// Redirect after save
			notification.$save(function(response) {
				$location.path('notifications/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.accept = function(id,index) {

			var tempTeam = [];
			tempTeam.push($scope.notifications[index].team.members);
			tempTeam.push({
				id: $scope.authentication.user._id
			});

			Teams.update({teamId:$scope.notifications[index].team._id}, 
				{members: [{id:$scope.authentication.user._id}]}, 
				function() {
				$scope.notifications[index].$remove(function() {
					$scope.notifications.splice(index,1);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.decline = function(index) {
			$scope.notifications[index].$remove(function() {
				$scope.notifications.splice(index,1);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Notification
		$scope.remove = function(notification) {
			if ( notification ) { 
				notification.$remove();

				for (var i in $scope.notifications) {
					if ($scope.notifications [i] === notification) {
						$scope.notifications.splice(i, 1);
					}
				}
			} else {
				$scope.notification.$remove(function() {
					$location.path('notifications');
				});
			}
		};

		// Update existing Notification
		$scope.update = function() {
			var notification = $scope.notification;

			notification.$update(function() {
				$location.path('notifications/' + notification._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Notifications
		$scope.find = function() {
			$scope.notifications = Notifications.query();
		};

		// Find existing Notification
		$scope.findOne = function() {
			$scope.notification = Notifications.get({ 
				notificationId: $stateParams.notificationId
			});
		};
	}
]);