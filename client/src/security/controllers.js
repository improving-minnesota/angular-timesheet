angular.module('app.security.controllers', [
  'authentication.services',
  'authorization.services',
  'security.services'
])

// The LoginCtrl provides the behaviour behind a reusable form to allow users to authenticate.
.controller('LoginCtrl', 
  function ($location, $stateParams, authentication, authorization, securityContext) {
    var vm = this;

    // Request the current user, this will wait until the current user
    // promise is resolved.
    authorization.requireAuthenticatedUser()
      .then(function () {
        // Once the user logs in, redirect to the state the user originally 
        // attempted to navigate to (passed in as a redirect parameter)
        if ($stateParams.redirect) {
          $location.path(decodeURIComponent($stateParams.redirect));
        // If not redirect, change the state to main
        } else {
          $location.path('/');
        }
      });

    // The model for this form 
    vm.user = {};

    // Any error message from failing to login
    vm.authError = null;

    // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
    // We could do something diffent for each reason here but to keep it simple...
    vm.authReason = null;
    if ( authentication.getLoginReason() ) {
      vm.authReason = ( securityContext.authenticated ) ?
        "You are not authorized to perform this action." : "";
    }

    // Attempt to authenticate the user specified in the form's model
    vm.login = function () {

      // Clear any previous security errors
      vm.authError = null;

      // Try to login
      authentication.login(vm.user.username, vm.user.password)
        .then(function () {
          if ( !securityContext.authenticated ) {
            // If we get here then the login failed due to bad credentials
            vm.authError = "Invalid username and password combination.";
          }
        })
        .catch(function (x) {
          // If we get here then there was a problem with the login request to the server
          vm.authError = "Invalid username and password combination.";
        });
    };

    vm.clearForm = function () {
      vm.user = {};
    };
  }
);
