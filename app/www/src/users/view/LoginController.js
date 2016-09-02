(function(){

  angular
       .controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
  $scope.credentials = {
    username: '',
    password: ''
  };

  $scope.login = function (credentials) {
    AuthService.login(credentials).then(function (user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(user);
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });
  };
});

// .constant('AUTH_EVENTS', {
//   loginSuccess: 'auth-login-success',
//   loginFailed: 'auth-login-failed',
//   logoutSuccess: 'auth-logout-success',
//   sessionTimeout: 'auth-session-timeout',
//   notAuthenticated: 'auth-not-authenticated',
//   notAuthorized: 'auth-not-authorized'
// });

/*

ref.authWithPassword({
  email    : username,
  password : password
}, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
});


  .service('Session', function () {
  this.create = function (sessionId, userId) {
    this.id = sessionId;
    this.userId = userId;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
  };
})*/
}
)