'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.page=0;
		//$scope.pageUrl='modules/templates/views/create-template.client.view.html';
		$scope.pageUrls=[
			'modules/templates/views/create-template.client.view.html',
			'modules/users/views/authentication/signin.client.view.html',
			'modules/templates/views/list-templates.client.view.html'
		];
		$scope.pageUrl=$scope.pageUrls[0];
		$scope.setPage= function(num){
			$scope.page=num;
			$scope.pageUrl=$scope.pageUrls[num];
		};
	}
]);