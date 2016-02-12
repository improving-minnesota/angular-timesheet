angular.module('app', [
  'ui.router',
  'app.resources',
  'app.controllers',
  'app.employees',
  'app.projects',
  'app.timesheets',
  'app.timesheets.timeunits'
])

  .config(function ($stateProvider) {

    $stateProvider
      .state('app', {
        abstract: true,
        url: '/app',
        data: {
          title: 'The Timesheet App'
        },
        views : {
          'navbar' : {
            controller: 'NavCtrl',
            controllerAs: 'navCtrl',
            templateUrl: 'assets/templates/app/navbar.html'
          },
          'content' : {
            controller: 'AppCtrl',
            controllerAs: 'appCtrl',
            templateUrl: 'assets/templates/app/index.html'
          }
        }
      });
  });
  