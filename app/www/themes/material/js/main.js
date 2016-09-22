"use strict";
var ang = angular
  .module('materialApp', ['ngMaterial',"ngCordova",'ui.router','ngRoute','firebase'])

  .run(function($rootScope, $cordovaDevice,$cordovaGeolocation,$mdToast){
    document.addEventListener("deviceready", function () {
      var networkState = navigator.connection.type;

      var states = {};
      $rootScope.initialLimit = 40;
      states[Connection.UNKNOWN]  = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI]     = 'WiFi connection';
      states[Connection.CELL_2G]  = 'Cell 2G connection';
      states[Connection.CELL_3G]  = 'Cell 3G connection';
      states[Connection.CELL_4G]  = 'Cell 4G connection';
      states[Connection.CELL]     = 'Cell generic connection';
      states[Connection.NONE]     = 'No network connection';

      if(networkState == Connection.CELL_3G || networkState == Connection.CELL_3G){
        $rootScope.initialLimit = 5;
      }

    });
  });
  ang.config(function($locationProvider,$mdThemingProvider, $mdIconProvider,$sceDelegateProvider,$httpProvider,$stateProvider,$urlRouterProvider){

        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise("/home");
        //
        // Now set up the states
        $stateProvider
          .state('home', {
            url: "/home",
            templateUrl: "./themes/material/components/home.html"
          })
          .state('history', {
            url: "/history",
            templateUrl: "./themes/material/components/history.html"
          })

          $mdIconProvider
                      .defaultIconSet("./assets/svg/avatars.svg", 128)
                      .icon("menu"       , "./assets/svg/menu.svg"        , 24)
                      .icon("share"      , "./assets/svg/share.svg"       , 24)
                      .icon("camera"     , "./assets/svg/camera.svg"      , 512)
                      .icon("landscape"   , "./assets/svg/landscape-picture.svg"    , 512);
          
        $mdThemingProvider.theme('default')
          .primaryPalette('orange')
          .accentPalette('red');

      document.addEventListener("deviceready", onDeviceReady, false);
      function onDeviceReady() {
          // console.log(navigator.compass);
      }
  }).filter('formatDate',function(){
    return function(input){
      var d = moment(input);
      return d.format('ddd, MMM Do');
    }
  })
  .filter('formatTime',function(){
    return function(input){
      var d = moment(input);
      return d.format('h:mm a');
    }
  })
  .filter('formatTimeRelative',function(){
    return function(input){
      var d = moment(input);
      return d.format('MMM Do, h:mm a');
    }
  })

.controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
  $scope.items = [
    { name: 'Save', icon: 'icon-save' },
    { name: 'Send', icon: 'icon-share' }
  ];
  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
})

.controller('DashCtrl', function($rootScope,$state,$scope,$mdSidenav,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray) {
//document.addEventListener("deviceready", function () {


  var self = this;
  self.isLoading=true;
  var config = {
      apiKey: "AIzaSyDrn6FZv475qfEtRnMgpOPBmhErAqcsebQ",
      authDomain: "phillydirections.firebaseapp.com",
      databaseURL: "https://phillydirections.firebaseio.com",
      storageBucket: "phillydirections.appspot.com",
    };
    firebase.initializeApp(config);

  $rootScope.pictures = $firebaseArray(firebase.database().ref().child($rootScope.userId + '/photos/'));
  $rootScope.pictures.$loaded(function(){
  })

  self.selected     = null;
    var leftMenu = [
      {
        name: 'New Route',
        avatar: 'compass',
        content: 'Take a picture of bus sign to route to destination'
      },
      {
        name: 'Past Routes',
        avatar: 'previous',
        content: 'View past 10 trips'
      },
      {
        name: 'Favorite Routes',
        avatar: 'star',
        content: 'Favorited routes here'
      }
    ];
    self.leftMenu = leftMenu;
    self.selectItem   = selectItem;
    self.toggleList   = toggleUsersList;
    self.takePic  = takePic;
    self.fireInOut = signInOut;
    self.signIn = signIn;
    self.registerUser = register;
    self.rotate = rotate;

  function rotate(ev){
      console.log(ev);
        var canvas = document.getElementById("image1")
        console.log(canvas);
        var canvas = ev.target.previousElementSibling;
        var ctx = canvas.getContext("2d");
        ctx.save();
         
        // var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(canvas.width /2, canvas.height/2);
        ctx.rotate(90 * Math.PI/180);
        ctx.drawImage($rootScope.imageObj,0,0,$rootScope.imageObj.width,$rootScope.imageObj.height, 0,0,150,150);
        ctx.restore();
        };


    function signInOut(){
      if($rootScope.fireUser !== undefined){
        if($rootScope.fireUser == null){
          self.signIn();
        }else{
          fbStorage.signOut();
          $state.go('home');
          window.location.reload(true);
        }
      }else{
        //undefined; login
        self.signIn();
      }
    }

    function signIn(){
      //Show Sign In dialog
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $rootScope.customFullscreen;
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        templateUrl:
        './themes/material/components/loginDialog.html',
        controller: LoginDialogController,
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: useFullScreen
      });

      $rootScope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $rootScope.customFullscreen = (wantsFullScreen === true);
        });

        $rootScope.userId = firebase.auth().currentUser.uid;

      
    }
    function register(){
      //Show Sign In dialog
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $rootScope.customFullscreen;
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        templateUrl:
        './themes/material/components/register.html',
        controller: RegisterDialogController,
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: useFullScreen
      });

      $rootScope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $rootScope.customFullscreen = (wantsFullScreen === true);
        });
      
    }

    function LoginDialogController(scope, $mdDialog,$firebaseAuth) {
      var auth = $firebaseAuth();
      scope.email = '';
      scope.test = 'true';
      scope.title = 'Sign In';
      scope.closeDialog = function() {
        $mdDialog.hide();
      }

      scope.loginUser = function(e){
          firebase.auth().signInWithEmailAndPassword(scope.email, scope.password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
              });
          $mdDialog.hide();
      }

      scope.register = function(e){
        scope.closeDialog();
        self.registerUser(e);
      }

      $rootScope.$watch(function(scope) { return $rootScope.fireUser },
      function() {
        if($rootScope.fireUser !== undefined && $rootScope.fireUser != null){
          scope.closeDialog();
        }else{

        }
        
      }
     );
    }

  var originatorEv;
  self.openMenu = function($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };

  angular.element(document).ready(function(){
    $rootScope.canvas = document.getElementById('image1');
    self.takePicture = document.querySelector("#take-picture");
    self.takePicture.onchange = function (event) {
      // Get a reference to the taken picture or chosen file
      var files = event.target.files,
      file;
      if (files && files.length > 0) {
        file = files[0];
        var reader = new FileReader();
        reader.onload = function(e){
          $rootScope.context = $rootScope.canvas.getContext('2d');
          $rootScope.imageObj = new Image();
          $rootScope.imageObj.onload = function() {
            $rootScope.context.drawImage($rootScope.imageObj,0,0,$rootScope.imageObj.width,$rootScope.imageObj.height, 0,0,150,150);
          }
          $rootScope.imageObj.src = reader.result;
        };

        reader.readAsDataURL(file);

        //Select directory based on user
        if($rootScope.userId != null){
          var curDir = firebase.auth().currentUser.uid;
        }else{
          var curDir = 'anonymous'
        }


        //Upload to Google


              var postData = file.name;

              var newPostKey = firebase.database().ref().child(curDir + '/photos/').push().key;

              var updates = {};
              updates['/' + curDir + '/photos/' + newPostKey] = postData;

              firebase.database().ref().update(updates);

              var storageRef = firebase.storage().ref().child(newPostKey);
              storageRef.put(file);
    };
  };
});

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      $mdSidenav('left').toggle();
    };

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectItem ( id ) {
      self.selected = angular.isNumber(id) ? $scope.leftMenu[id] : id;
    };

    /**
     * Show the Contact view in the bottom sheet
     */
    function takePic(ev) {
      console.log(ev);
      angular.element(ev.target).parent().children()[1].click();
    };




    function RegisterDialogController(scope, $mdDialog,$firebaseAuth) {
      var auth = $firebaseAuth();
      scope.email = '';
      scope.test = 'true';
      scope.warning = 'Register';
      scope.closeDialog = function() {
        $mdDialog.hide();
      }

      scope.login = function(e) {
        $mdDialog.hide();
        self.signIn(e);
      }

      scope.register = function(e){

          firebase.auth().createUserWithEmailAndPassword(scope.email, scope.password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
          $mdDialog.hide();
 
      }

      $rootScope.$watch(function(scope) { return $rootScope.fireUser },
      function() {
        if($rootScope.fireUser !== undefined && $rootScope.fireUser != null){
          scope.closeDialog();
          $mdToast.show(
              $mdToast.simple()
              .content("Welcome to DealSpace!")
              .position('top left')
              .hideDelay(1000)
            );
        }else{

        }
        
      }
     );
    }

  
})
