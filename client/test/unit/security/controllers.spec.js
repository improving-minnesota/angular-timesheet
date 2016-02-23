describe('Security', function() {

  var expect = chai.expect;
  var controller;
 
  describe('Controllers', function() {
      
    beforeEach(
      module(
        'ngResource',
        'app.resources',
        'security.services',
        'authentication.services',
        'notifications.services',
        'app.security',
        'app.security.controllers'
      ));

    describe('LoginCtrl', function() {
      it('should be able to instantiate the controller',
        inject(function($controller) {
            controller = $controller("LoginCtrl");
          
          expect(controller).to.be.ok;
      }));
    });

  });
});
