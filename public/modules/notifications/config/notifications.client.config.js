'use strict';

// Configuring the Articles module
angular.module('notifications').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('Notification', 'Notifications', 'notifications', 'dropdown', '/notifications(/create)?');
		Menus.addSubMenuItem('Notification', 'notifications', 'List Notifications', 'notifications');
		Menus.addSubMenuItem('Notification', 'notifications', 'New Notification', 'notifications/create');
	}
]);