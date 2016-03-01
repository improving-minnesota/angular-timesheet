describe('Form components', function() {

  var expect = chai.expect;

  var component,
  scope,
  $componentController,
  $compile,
  $httpBackend;

  beforeEach(module(
    'form.components',
    'ngResource',
    'assets/templates/components/form/form-header.html'
  ));

  beforeEach(inject(function($rootScope,  _$componentController_) {
    
    //You must always provide a scope object as part of the definition of the component.
    scope = $rootScope.$new();
    $componentController = _$componentController_;
  }));

  describe('tszFormSectionHeader', function () {

    beforeEach(function () {
      component = $componentController('tszFormSectionHeader', {
        $scope: scope
      },
      {
        header: 'My Header'
      });
    });

    describe('header attribute', function() {
      it('should set the header content within the directive template', function() {
        expect(component.header).to.equal('My Header');
      });
    });

  });

});