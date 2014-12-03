'use strict';

//Setting up route
angular.module('templates')
.config(['$stateProvider',
	function($stateProvider) {
		// Templates state routing
		$stateProvider.
		state('listTemplates', {
			url: '/templates',
			templateUrl: 'modules/templates/views/list-templates.client.view.html'
		}).
		state('createTemplate', {
			url: '/templates/create',
			templateUrl: 'modules/templates/views/create-template.client.view.html'
		}).
		state('viewTemplate', {
			url: '/templates/:templateId',
			templateUrl: 'modules/templates/views/view-template.client.view.html'
		}).
		state('editTemplate', {
			url: '/templates/:templateId/edit',
			templateUrl: 'modules/templates/views/edit-template.client.view.html'
		});
	}

])
.run( function($rootScope, $location, Authentication) {
    // register listener to watch route changes
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      if ( Authentication.user === '' ) {
        // no logged user, we should be going to #login
        if ( $location.url().match('/templates') ) {
          // not going to #/signin, we should redirect now
          $location.path( '/signin' );
        }
      }       
    });
 });