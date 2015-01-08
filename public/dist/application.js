'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'checklist';
	var applicationModuleVendorDependencies = ['ngResource', 'ngRoute', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', "ui.sortable", 'btford.socket-io'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('checklists');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('teams');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('templates');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Configuring the Articles module
angular.module('checklists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Checklists', 'checklists', 'dropdown', '/checklists(/create)?');
		Menus.addSubMenuItem('topbar', 'checklists', 'List Checklists', 'checklists');
		//Menus.addSubMenuItem('topbar', 'checklists', 'New Checklist', 'checklists/create');
	}
]);
'use strict';

//Setting up route
angular.module('checklists').config(['$stateProvider',
	function($stateProvider) {
		// Checklists state routing
		$stateProvider.
		state('listChecklists', {
			url: '/checklists',
			templateUrl: 'modules/checklists/views/list-checklists.client.view.html'
		}).
		state('createChecklist', {
			url: '/checklists/create',
			templateUrl: 'modules/checklists/views/create-checklist.client.view.html'
		}).
		state('instantiateChecklist', {
			url: '/checklists/create/:templateId',
			templateUrl: 'modules/checklists/views/findTemplate.html'
		}).
		state('viewChecklist', {
			url: '/checklists/:checklistId',
			templateUrl: 'modules/checklists/views/view-checklist.client.view.html'
		}).
		state('editChecklist', {
			url: '/checklists/:checklistId/edit',
			templateUrl: 'modules/checklists/views/edit-checklist.client.view.html'
		});
	}
])
.run( ["$rootScope", "$location", "Authentication", function($rootScope, $location, Authentication) {
    // register listener to watch route changes
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      if ( Authentication.user === '' ) {
        // no logged user, we should be going to /signin
        if ( $location.url().match('/checklists') ) {
          $location.path( '/signin' );
        }
      }       
    });
 }]);
'use strict';

// Checklists controller
angular.module('checklists').controller('ChecklistsController', ['$scope', '$stateParams', '$location', '$http', 'Socket', 'Authentication', 'Checklists',
	function($scope, $stateParams, $location, $http, Socket, Authentication, Checklists ) {
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
		if($scope.checklist.taskList!== undefined){

			for (var i = $scope.checklist.taskList.length - 1; i >= 0; i--) {
	    		if($scope.checklist.taskList[i].isDone===true)
	    			numDone++;
    		}
    		return Math.round(100* numDone / $scope.checklist.taskList.length);
		}
		return 0;
    };

    // listening for the 'checklist.updated' event through the socket
    Socket.on('checklist.updated', function(checklist) {
   	
    	// Update the tasks of $scope.checklist from the new checklist
    	for (var i = $scope.checklist.taskList.length - 1; i >= 0; i--) {
    		$scope.checklist.taskList[i].isDone=checklist.taskList[i].isDone;
    	}

		});

	}
]);
'use strict';

//Checklists service used to communicate Checklists REST endpoints
angular.module('checklists')
	.factory('Checklists', ['$resource',
		function($resource) {
			return $resource('checklists/:checklistId', { checklistId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		

		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
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
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

/*global io:false */		// declares to JSHint that 'io' is a global variable and won't complain about it anymore.

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',
    function(socketFactory) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect('http://localhost:3000')
        });
    }
]);
'use strict';

// Configuring the Articles module
angular.module('teams').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Teams', 'teams', 'dropdown', '/teams(/create)?');
		Menus.addSubMenuItem('topbar', 'teams', 'List Teams', 'teams');
		Menus.addSubMenuItem('topbar', 'teams', 'New Team', 'teams/create');
	}
]);
'use strict';

//Setting up route
angular.module('teams').config(['$stateProvider',
	function($stateProvider) {
		// Teams state routing
		$stateProvider.
		state('listTeams', {
			url: '/teams',
			templateUrl: 'modules/teams/views/list-teams.client.view.html'
		}).
		state('createTeam', {
			url: '/teams/create',
			templateUrl: 'modules/teams/views/create-team.client.view.html'
		}).
		state('viewTeam', {
			url: '/teams/:teamId',
			templateUrl: 'modules/teams/views/view-team.client.view.html'
		}).
		state('editTeam', {
			url: '/teams/:teamId/edit',
			templateUrl: 'modules/teams/views/edit-team.client.view.html'
		});
	}
]);
'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Teams',
	function($scope, $stateParams, $location, Authentication, Teams) {
		$scope.authentication = Authentication;

		// Create new Team
		$scope.create = function() {
			// Create new Team object
			var team = new Teams ({
				name: this.name
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
	}
]);
'use strict';

//Teams service used to communicate Teams REST endpoints
angular.module('teams').factory('Teams', ['$resource',
	function($resource) {
		return $resource('teams/:teamId', { teamId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('templates').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Templates', 'templates', 'dropdown', '/templates(/create)?');
		Menus.addSubMenuItem('topbar', 'templates', 'List Templates', 'templates');
		Menus.addSubMenuItem('topbar', 'templates', 'New Template', 'templates/create');
	}
]);
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
.run( ["$rootScope", "$location", "Authentication", function($rootScope, $location, Authentication) {
    // register listener to watch route changes
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      if ( Authentication.user === '' ) {
        // no logged user, we should be going to /signin
        if ( $location.url().match('/templates') ) {
          $location.path( '/signin' );
        }
      }       
    });
 }]);
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

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invlaid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);