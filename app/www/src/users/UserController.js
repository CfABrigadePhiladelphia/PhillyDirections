(function(){

  angular
       .module('users')
       .controller('UserController', [
          'userService', '$mdSidenav', '$mdBottomSheet', '$timeout', '$log',
          UserController
       ]);


  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */


  function UserController( userService, $mdSidenav, $mdBottomSheet, $timeout, $log ) {
    var self = this;
    var config = {
      apiKey: "AIzaSyDrn6FZv475qfEtRnMgpOPBmhErAqcsebQ",
      authDomain: "phillydirections.firebaseapp.com",
      databaseURL: "https://phillydirections.firebaseio.com",
      storageBucket: "phillydirections.appspot.com",
    };
    firebase.initializeApp(config);

    self.selected     = null;
    self.users        = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.takePic  = takePic;

    // Load all registered users

    userService
          .loadAllUsers()
          .then( function( users ) {
            self.users    = [].concat(users);
            self.selected = users[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    angular.element(document).ready(function(){
      self.takePicture = document.querySelector("#take-picture");
      self.takePicture.onchange = function (event) {
          // Get a reference to the taken picture or chosen file
          var files = event.target.files,
              file;
          if (files && files.length > 0) {
              file = files[0];

              var storageRef = firebase.storage().ref().child(file.name);
              storageRef.put(file).then(function(snapshot) {
                console.log(snapshot);
              });
            }
        //var uploadTask = storageRef.child('images/' + file.name).put(file);
          
      };
    })
    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user ) {
      self.selected = angular.isNumber(user) ? $scope.users[user] : user;
    }

    /**
     * Show the Contact view in the bottom sheet
     */
    function takePic(ev) {
      console.log(ev);
      angular.element(ev.target).parent().children()[1].click();


    }


  }

})();
