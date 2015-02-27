'use strict';

// declares to JSHint that the following are global variables and won't complain about them anymore.
/*global io:false */		
/*global nodeEnv:false*/

//socket factory that provides the socket service
angular.module('core')

	.factory('env', function(){
    return '{{=it.env}}';
	})

  .factory('host', function(){
    return '{{=it.host}}';
  })

	.factory('Socket', ['socketFactory',

    function(socketFactory, env, host) {

   //  	var checklistSocketURL;

    	// Environment dependent checklistSocketURL
			// if (env === 'development') {
			// 	checklistSocketURL = 'http://localhost:3000';
			// } else if (env === 'production') {
			// 	checklistSocketURL = '';
			// }
      
      return socketFactory({
          prefix: '',
          // ioSocket: io.connect(checklistSocketURL, {secure: true})
      		// ioSocket: io.connect('https://teamfit-checklist.herokuapp.com/', {secure: true})
          // ioSocket: io.connect('/', {transports: ['websocket'], secure: true})
          ioSocket: io.connect('localhost:3000/', {transports: ['websocket'], secure: true})
      });
    }
	]); 
