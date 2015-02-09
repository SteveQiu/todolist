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

   //  	var checklistSocketURL;

    	// Environment dependent checklistSocketURL
			// if (env === 'development') {
			// 	checklistSocketURL = 'http://localhost:3000';
			// } else if (env === 'production') {
			// 	checklistSocketURL = '';
			// }
      var host = location.origin;
      return socketFactory({
          prefix: '',
          // ioSocket: io.connect(checklistSocketURL, {secure: true})
      		// ioSocket: io.connect('https://teamfit-checklist.herokuapp.com/', {secure: true})
          ioSocket: io.connect(host, {port: 3000, transports: ['websocket']})
      });
    }
	]); 
