'use strict';

// Checklists controller
angular.module('checklists').controller('ChecklistsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Checklists',
	function($scope, $stateParams, $location, $http, Authentication, Checklists ) {
		$scope.authentication = Authentication;
		$scope.taskList = [];
		$scope.taskInput = '';
		$scope.templateId = $stateParams.templateId;

		// Create new Checklist
		$scope.create = function() {
			// Create new Checklist object
			var checklist = new Checklists ({
				name: this.name
			});

			// Redirect after save
			checklist.$save(function(response) {
				$location.path('checklists/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Checklist
		$scope.remove = function( checklist ) {
			if ( checklist ) { checklist.$remove();

				for (var i in $scope.checklists ) {
					if ($scope.checklists [i] === checklist ) {
						$scope.checklists.splice(i, 1);
					}
				}
			} else {
				$scope.checklist.$remove(function() {
					$location.path('checklists');
				});
			}
		};

		// Update existing Checklist
		$scope.update = function() {
			var checklist = $scope.checklist ;

			checklist.$update(function() {
				$location.path('checklists/' + checklist._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Checklists
		$scope.find = function() {
			$scope.checklists = Checklists.query();
		};

		// Find existing Checklist
		$scope.findOne = function() {
			$scope.checklist = Checklists.get({ 
				checklistId: $stateParams.checklistId
			});
		};

		$scope.findTemplate = function() {
	        $http.get('/templates/'+ $scope.templateId)
	            .success(function (data, status, headers, config) {
	                // alert('Sending request to /templates/'+ $scope.templateId);
	                $scope.template= data;
	                //
	                var checklist = new Checklists ({
						name: $scope.template.name,
						taskList: $scope.template.taskList
					});

					$scope.checklist = checklist;

					// Redirect after save
					checklist.$save(function(response) {
						$location.path('checklists/' + response._id);
						$scope.name = '';
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
	                //
	            })
	            .error(function (data, status, headers, config) {
	                alert('Template does not exist!');
	            });             
        };

        $scope.percentage = function() {
        	var numDone = 0;
        	for (var i = $scope.checklist.taskList.length - 1; i >= 0; i--) {
        		if ($scope.checklist.taskList[i].isDone===true) {
        			numDone++;
        		}
        	}
        	// $scope.percent = numDone / $scope.checklist.taskList.length;
        	return Math.round(100* numDone / $scope.checklist.taskList.length);
        };
	}
]);