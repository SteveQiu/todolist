'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Teams', 'Notifications', 
	function($scope, $stateParams, $location, Authentication, Teams,Notifications) {
		$scope.authentication = Authentication;
		$scope.memberList = [{id: $scope.authentication.user._id}];
		$scope.memberInput = '';

		// Create new Team
		$scope.create = function() {
			// Create new Team object
			var team = new Teams ({
				name: this.name,
				members: this.memberList
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

		$scope.addMember = function(team) {
			
			$scope.team = Teams.get({ 
				teamId: $stateParams.teamId
			});

			var notification = new Notifications ({
				name: $scope.memberInput,
				team: $stateParams.teamId
			});

			// Redirect after save
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

		$scope.checkAccess = function(){
			if ($scope.team.user===undefined) {
				return false;
			}
			return ($scope.team.user._id===$scope.authentication.user._id);
		};
	}
]);