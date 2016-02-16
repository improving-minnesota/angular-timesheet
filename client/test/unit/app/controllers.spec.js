describe('App', function() {

  var expect = chai.expect;
  var controller;
 
  describe('Controllers', function() {
      
    beforeEach(
      module( 
        'app.controllers'
      ));

    describe('MainCtrl', function() {
      beforeEach(inject(function($controller) {
        controller = $controller("MainCtrl");
      }));

      describe('setup', function () {
        it('should be able to instantiate the controller', function () { 
          expect(controller).to.be.ok;
        });
      }); 
    });

    describe('AppCtrl', function() {

      beforeEach(inject(function($controller) {
        controller = $controller("AppCtrl");
      }));

      describe('setup', function () {
        it('should be able to instantiate the controller', function () { 
          expect(controller).to.be.ok;
        });
      }); 
    });

    describe('NavCtrl', function() {

      beforeEach(inject(function($controller) {
        controller = $controller("NavCtrl");
      }));

      describe('setup', function () {
        it('should be able to instantiate the controller', function () { 
          expect(controller).to.be.ok;
        });
      }); 
    });

  });
});
