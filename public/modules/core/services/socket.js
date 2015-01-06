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