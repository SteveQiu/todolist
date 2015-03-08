'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Teams', 'Notifications', 'Users',
	function($scope, $stateParams, $location, Authentication, Teams, Notifications, Users) {
		$scope.authentication = Authentication;
		// $scope.memberList = [{id: $scope.authentication.user._id}];
		// $scope.inviteList = [];
		$scope.memberInput = '';

		// Create new Team
		$scope.create = function() {
			// Create new Team object
			var team = new Teams ({
				name: this.name,
				members: [{id: $scope.authentication.user._id}]
			});

			// Redirect after save
			team.$save(function(response) {
				$location.path('teams/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// $scope.invite = function() {
		// 	if ($scope.memberInput === '') {
		// 		return;
		// 	}
		// 	var newMember = {email: $scope.memberInput};
		// 	$scope.inviteList.push(newMember);
		// 	$scope.memberInput = '';

		// };

		$scope.addMember = function() {

			var notification = new Notifications ({
				email: $scope.memberInput,
				team: $stateParams.teamId
			});

			notification.$save(function(response) {
				// Clear form fields
				$scope.memberInput = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.memberListSortable = {
			containment: 'parent',
			cursor: 'move',
			tolerance: 'pointer'
		};

		$scope.deleteMember = function(index,team) {
			if(team)
				team.splice(index,1);
			else
				this.team.splice(index,1);
		};

		// Remove existing Team
		$scope.remove = function(team) {
			if ( team ) { 
				team.$remove();

				for (var i in $scope.teams) {
					if ($scope.teams [i] === team) {
						$scope.teams.splice(i, 1);
					}
				}
			} else {
				$scope.team.$remove(function() {
					$location.path('teams');
				});
			}
		};

		// Update existing Team
		$scope.update = function() {
			var team = $scope.team;

			team.$update(function() {
				$location.path('teams/' + team._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Teams
		$scope.find = function() {
			$scope.teams = Teams.query();
		};

		// Find existing Team
		$scope.findOne = function() {
			$scope.team = Teams.get({ 
				teamId: $stateParams.teamId
			});
		};

		$scope.findTeamNotification = function() {
			$scope.notification = Notifications.query();
		};

		$scope.checkAccess = function(){
			if ($scope.team.user===undefined) {
				return false;
			}
			return ($scope.team.user._id===$scope.authentication.user._id);
		};

		$scope.$on('team.list.update', function (event, args) {
			$scope.find();
		});
	}
]);