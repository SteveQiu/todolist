'use strict';

// angular.module('templates', ['ui.bootstrap']);

// Templates controller
angular.module('templates').controller('TemplatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Templates','Checklists','$modal','Teams',
	function($scope, $stateParams, $location, Authentication, Templates , Checklists, $modal, Teams) {
		$scope.authentication = Authentication;
		$scope.taskList = [];
		$scope.taskInput = '';

		// Create new Template
		$scope.create = function(templateCopy) {
			// Create new Template object
			var template;
			if (templateCopy) {
				template = new Templates ({
					name: templateCopy.name+' Copy',
					taskList: templateCopy.taskList
				});
			}
			else{
				template = new Templates ({
					name: this.name,
					taskList: this.taskList
				});
			}
			
			// Redirect after save
			template.$save(function(response) {
				$location.path('templates/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.useChecklist = function() {

                var checklist = new Checklists ({
					name: $scope.template.name,
					taskList: $scope.template.taskList
				});

				$scope.checklist = checklist;

				// Redirect after save
				checklist.$save(function(response) {
					$location.path('checklists/' + response._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});

    	};

		$scope.addTask = function(template) {
			if ($scope.taskInput === '') {
				return;
			}
			var newTask = {name: $scope.taskInput, isDone: false};
			if(template){
				template.push(newTask);
			}
			else{
				$scope.taskList.push(newTask);
			}
			$scope.taskInput = '';

			$scope.template.action = 'created task';
			$scope.template.itemName = newTask.name;
		};

		$scope.taskListSortable = {
			containment: 'parent',
			cursor: 'move',
			tolerance: 'pointer'
		};

		$scope.deleteTask = function(index,taskList) {
			if(taskList){
				$scope.template.action = 'removed task';
				$scope.template.itemName = taskList[index].name;

				taskList.splice(index,1);
			}
			else
				this.taskList.splice(index,1);
		};

		// Remove existing Template
		$scope.remove = function( template ) {

			if ( template ) { template.$remove();

				for (var i in $scope.templates ) {
					if ($scope.templates [i] === template ) {
						$scope.templates.splice(i, 1);
					}
				}
			} else {
				$scope.template.$remove(function() {
					$location.path('templates');
				});
			}
		};

		// Update existing Template
		$scope.update = function() {
			var template = $scope.template ;

			template.$update(function() {
				$location.path('templates/' + template._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Templates
		$scope.find = function() {
			$scope.templates = Templates.query();
		};

		// Find existing Template
		$scope.findOne = function() {
			$scope.template = Templates.get({ 
				templateId: $stateParams.templateId
			});
			$scope.taskList=$scope.template.taskList;
		};

		$scope.checkCreator = function(){
			if ($scope.template.user===undefined) {
				return false;
			}
			return ($scope.template.user._id===$scope.authentication.user._id||false);
		};

		// modal
		

		$scope.open = function (size) {
			// $scope.items = ['Team A', 'Team B', 'Team C'];
			$scope.teams = Teams.query();

		    var modalInstance = $modal.open({
					templateUrl: 'myModalContent.html',
					controller: 'ModalInstanceCtrl',
					size: size,
					resolve: {
						teams: function () {
						  return $scope.teams;
						}
		    		}
		    });

		    modalInstance.result.then(function (selectedItem) {
		    	// register checklist with team name
		    	var checklist = new Checklists ({
					name: $scope.template.name,
					team: $scope.teams[selectedItem]._id,
					taskList: $scope.template.taskList
				});
				checklist.$save(function(response) {
					// push method 1
					var checklists=[];
					var team = $scope.teams[selectedItem];
					for (var i = team.checklists.length - 1; i >= 0; i--) {
						checklists.push(team.checklists[i]._id);
					}
					checklists.push(response._id);
					team.checklists=checklists;
					// after creating the checklist
					// update the team , response._id contains checklist id
					// push method 2
					// $scope.teams[selectedItem].checklists.push(response._id);
					team.$update(function() {
						// Redirect after save
						$location.path('checklists/' + response._id);
					}, function(errorResponse) {
						// alert('fail');
						$scope.error = errorResponse.data.message;
					});
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});

		    }, function () {
		      // $log.info('Modal dismissed at: ' + new Date());
		    });

		};

}]);

angular.module('templates').controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'teams',
function($scope, $modalInstance, teams) {
	$scope.teams = teams;
	// default init
	$scope.selected = 0;

	$scope.choose = function (index) {
		$scope.selected = index;
	};

	$scope.ok = function (index) {
		// $modalInstance.close($scope.selected.team);
		$modalInstance.close($scope.selected);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

}]);