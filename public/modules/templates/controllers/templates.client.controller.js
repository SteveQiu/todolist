'use strict';

// Templates controller
angular.module('templates').controller('TemplatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Templates',
	function($scope, $stateParams, $location, Authentication, Templates ) {
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
		};

		$scope.taskListSortable = {
			containment: 'parent',
			cursor: 'move',
			tolerance: 'pointer'
		};

		$scope.deleteTask = function(index,taskList) {
			if(taskList)
				taskList.splice(index,1);
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
			return ($scope.template.user._id===$scope.authentication.user._id);
		};

	}
]);