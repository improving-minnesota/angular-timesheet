angular.module('app.controllers', [])

  .controller('MainCtrl', function ($scope, securityContext){
    
    // TODO : Watch securityContext for changes and update 
    // authenticated and loggedInUser on scope

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