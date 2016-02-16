angular.module('app', [
  'app.controllers',
  'ngRoute'
])

.config(function ($routeProvider) {

  $routeProvider
    .when("/home", {
      templateUrl: 'assets/templates/index.html',
      controller: 'AppCtrl',
      controllerAs: 'appCtrl'
    })
    .otherwise({redirectTo: '/home'});
});
  