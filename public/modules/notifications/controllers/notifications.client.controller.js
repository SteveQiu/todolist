'use strict';

// Notifications controller
angular.module('notifications').controller('NotificationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notifications', 'Teams', '$timeout',
	function($scope, $stateParams, $location, Authentication, Notifications, Teams, $timeout) {
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

		$scope.accept = function(mem,index) {


			var cancelNotification = function(){
				$scope.notifications[index].$remove(function() {
						$scope.notifications.splice(index,1);
						// $location.path('teams');
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
			};

			for (var i = mem.length - 1; i >= 0; i--) {
				if(mem[i].id === $scope.authentication.user._id){
					cancelNotification();
					return true;
				}
			}
			mem.push({id: $scope.authentication.user._id});

			Teams.update({teamId:$scope.notifications[index].team._id}, {members: mem}, 
				function() {
					// $scope.notifications[index].$remove(function() {
					// 	$scope.notifications.splice(index,1);
					// 	// $location.path('teams');
					// }, function(errorResponse) {
					// 	$scope.error = errorResponse.data.message;
					// });
					cancelNotification();
					// broadcast event
					
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				}
			);

			$timeout(function(){$scope.$root.$broadcast('team.list.update', 'team update');});
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