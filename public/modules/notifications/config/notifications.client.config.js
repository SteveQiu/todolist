'use strict';

// Configuring the Articles module
angular.module('notifications').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Notifications', 'notifications', 'dropdown', '/notifications(/create)?');
		Menus.addSubMenuItem('topbar', 'notifications', 'List notifications', 'notifications');
		Menus.addSubMenuItem('topbar', 'notifications', 'New Checklist', 'checklists/create');
	}
]);