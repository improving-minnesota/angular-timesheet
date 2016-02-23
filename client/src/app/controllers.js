angular.module('app.controllers', [])

  .controller('MainCtrl', function ($scope, securityContext){
    var vm = this;

    $scope.$watch(function () {
      return securityContext.authenticated;
    },
    function (authenticated) {
      vm.authenticated = authenticated;
      vm.loggedInUser = securityContext.user;
    });

  })
  
  .controller('AppCtrl', 
    function (){
      
    }
  )

  .controller('NavCtrl', 
    function (authentication) {
      var vm = this;
    
      vm.logout = function logout () {
        authentication.logout();
      };
    }
  );