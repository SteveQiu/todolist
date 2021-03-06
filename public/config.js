'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'checklist';
	var applicationModuleVendorDependencies = ['ngResource', 'ngRoute', 'ngCookies',  'ngAnimate',
		'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', "ui.sortable",
		'btford.socket-io', 'mobile-angular-ui'];

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