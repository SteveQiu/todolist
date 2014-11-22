'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.navTab=0;
		$scope.pageUrl='welcome.html';
		$scope.setTab= function(num){
			$scope.navTab=num;
		};
		$scope.setPage=function(pageUrl){
			$scope.pageUrl= pageUrl;
		};
	}
]);