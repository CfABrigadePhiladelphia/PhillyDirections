"use strict";
angular
  .module('materialApp', ['ngMaterial',"ngCordova",'ui.router','ngRoute','firebase','ngSanitize'])
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