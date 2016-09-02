(function(){
  'use strict';

  angular.module('login')
         .service('loginService', ['$q', loginService]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function loginService($q){
    var logins = [
      {
        username: 'username',
        password: 'password',
      }
    ];

    // Promise-based API
    return {
      loadAllUsers : function() {
        // Simulate async nature of real remote calls
        return $q.when(users);
      }
    };
  }

//   <form name="loginForm" ng-controller="LoginController"
//       ng-submit="login(credentials)" novalidate>
//   <label for="username">Username:</label>
//   <input type="text" id="username"
//          ng-model="credentials.username">
//   <label for="password">Password:</label>
//   <input type="password" id="password"
//          ng-model="credentials.password">
//   <button type="submit">Login</button>
// </form>


})();
