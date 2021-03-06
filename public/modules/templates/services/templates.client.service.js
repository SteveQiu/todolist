'use strict';

//Templates service used to communicate Templates REST endpoints
angular.module('templates')
.factory('Templates', ['$resource',
	function($resource) {
		return $resource('templates/:templateId', { templateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])

.directive( 'editInPlace', function() {
  return {
    restrict: 'E',
    scope: { value: '=' },
    template: '<span ng-click="edit()" ng-bind="value"></span><input ng-model="value"></input>',
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = angular.element( element.children()[1] );
      
      // This directive should have a set class so we can style it.
      element.addClass( 'edit-in-place' );
      
      // Initially, we're not editing.
      $scope.editing = false;
      
      // ng-click handler to activate edit-in-place
      $scope.edit = function () {
        $scope.editing = true;
        
        // We control display through a class on the directive itself. See the CSS.
        element.addClass( 'active' );
        
        // And we must focus the element. 
        // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function, 
        // we have to reference the first element in the array.
        inputElement[0].focus();
      };
      
      // When we leave the input, we're done editing.
      //inputElement.prop( 'onblur', function() {
      inputElement.on( 'blur', function() {
        $scope.editing = false;
        element.removeClass( 'active' );
      });
    }
  };
})

.directive('ngEnter',function  () {
 return function  (scope, elem, attrs) {
  /* replace $(elem) with elem */
  (elem).keyup(function  (e) {
   //Enter Button Keycode is 13
   if (e.keyCode === 13) {
    //Calls the function mapped to ng-enter in the markup
    scope.$apply(function () {
      scope.$eval(attrs.ngEnter);
    });
   }
  });
 };
});
