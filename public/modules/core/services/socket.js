'use strict';

// declares to JSHint that the following are global variables and won't complain about them anymore.
/*global io:false */		
/*global nodeEnv:false*/

//socket factory that provides the socket service
angular.module('core')

	.factory('env', function(){
    return '{{=it.env}}';
	})

	.factory('Socket', ['socketFactory',

    function(socketFactory, env) {

    	var checklistSocketURL;

    	// Environment dependent checklistSocketURL
			if (env === 'development') {
				checklistSocketURL = 'https://localhost:3000';
			} else if (env === 'production') {
				checklistSocketURL = '';
			}

      return socketFactory({
          prefix: '',
          ioSocket: io.connect(checklistSocketURL, {secure: true})
      });
    }
]); 
