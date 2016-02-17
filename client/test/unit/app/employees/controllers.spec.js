describe('Employees', function() {

  var expect = chai.expect;
  var $controller,
    $httpBackend,
    $state,
    $stateParams,
    controller, 
    employee,
    spies,
    api;
 
  describe('Controllers:', function() {
      
    beforeEach(
      module(
        'ui.router',
        'ngResource',
        'app.resources',
        'app.employees',
        'app.employees.controllers'
      ));

    beforeEach(inject(function (_$httpBackend_, _$controller_, _$state_, _$stateParams_){
      $httpBackend = _$httpBackend_;
      $controller = _$controller_;
      $state = _$state_;
      $stateParams = _$stateParams_;
    }));

    beforeEach(inject(function ($injector) {
      api = $injector.get('api');

      spies = {
        state: sinon.stub($state)
      };

      employee = {
        "_id": "1234567890",
        "username": "test",
        "email": "test@test.com",
        "password": "password",
        "admin": true,
        "firstName": "Test",
        "lastName": "User"
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('EmployeeCtrl', function() {

      beforeEach(function() {
        controller = $controller("EmployeeCtrl", { 
          $state: spies.state,
          $stateParams: $stateParams
        });

        $httpBackend.when('GET', '/users').respond(200, [{username: 'testUser'}]);
      });

      describe('during setup', function () {
        it('should be able to instantiate the controller and request a page of employees', function () { 
          expect(controller).to.be.ok; 
          // controller.requestEmployees is called upon controller creation
          $httpBackend.expect('GET', '/users');
          $httpBackend.flush();
        });
      }); 

      describe('requesting employees', function () {

        it('should set the result to the employees', function () {
          $httpBackend.expect('GET', '/users');
          controller.requestEmployees();
          $httpBackend.flush();
          expect(controller.employees[0].username).to.equal("testUser");
        }); 

      });

      describe('showing employee detail', function () {
        
        it('should transition to the employee detail state', function () {
          $httpBackend.flush();
          controller.showDetail(employee);
          expect(spies.state.go).to.have.been.calledWith('app.employees.detail');
        });
      });

      describe('creating a new employee', function () {
        it('should transition to the create employee state', function () {
          $httpBackend.flush();
          controller.createNew();
          expect(spies.state.go).to.have.been.calledWith('app.employees.create');
        });
      });

      describe('removing a employee', function () {

        it('should send a remove request for the specified employee', function () {
          $httpBackend.flush();
          $httpBackend.expect('PUT', '/users/' + employee._id).respond(200);
          controller.remove(employee);
          $httpBackend.flush();
        });

        describe('successfully', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/users/' + employee._id).respond(200);
          });

          it('should set the employee to deleted for the ui', function () {
            controller.remove(employee);
            $httpBackend.flush();
            expect(employee.deleted).to.be.true;
          });
        });

        describe('in error', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/users/' + employee._id).respond(500);
          });

          it('should set deleted to false for the employee in the ui', function () {
            controller.remove(employee);
            $httpBackend.flush();
            expect(employee.deleted).to.be.false;
          });
        });

      });

      describe('restore', function () {
        beforeEach(function () {
          employee.deleted = true;
        });

        it('should send a restore request for the specified employee', function () {
          $httpBackend.flush();
          $httpBackend.expect('PUT', '/users/' + employee._id).respond(200);
          controller.restore(employee);
          $httpBackend.flush();
        });

        describe('successfully', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/users/' + employee._id).respond(200);
          });

          it('should set the employee to not deleted for the ui', function () {
            controller.restore(employee);
            $httpBackend.flush();
            expect(employee.deleted).to.be.false;
          });
        });

        describe('in error', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/users/' + employee._id).respond(500);
          });

          it('should set deleted to true for the employee in the ui', function () {
            controller.restore(employee);
            $httpBackend.flush();
            expect(employee.deleted).to.be.true;
          });
        });
      });

      describe('cancel', function () {
        it('should return back to the employee list', function () {
          $httpBackend.flush();
          controller.cancel();
          expect(spies.state.go).to.have.been.calledWith('app.employees');
        });
      });

    });

    describe('EmployeeDetailCtrl', function() {
      
      beforeEach(function() {
        spies.state.current = {data: {saveText: 'update'}};

        controller = $controller("EmployeeDetailCtrl", {
          employee: new api.employees(employee)
        });
      });

      describe('setup', function () {
        it('should be able to instantiate the controller', function () {
          expect(controller).to.be.ok;
        });

        it('should set saveText to the current state saveText', function () {
          expect(controller.saveText).to.equal('update');
        });

        it('should set the employee on scope to the resolved employee', function () {
          expect(controller.employee._id).to.equal(employee._id);
          expect(controller.employee.username).to.equal(employee.username);
        });
      });

      describe('Saving an edited employee', function () {
        var updatedEmployee;

        beforeEach(function () {
          updatedEmployee = angular.extend(employee, {username: 'updated'});
          $httpBackend.expect('PUT', '/users/' + employee._id);
        });

        describe('with success', function () {

          beforeEach(function () {
            $httpBackend.when('PUT', '/users/' + employee._id).respond(200, updatedEmployee);
          });

          it('should set the employee on scope to be the updated employee', function () {
            controller.save();
            $httpBackend.flush();
            expect(controller.employee.username).to.equal(updatedEmployee.username);
          });
        });

      });
    });

    describe('EmployeeCreateCtrl', function() {

      beforeEach(function() {
        spies.state.current = {data: {saveText: 'create'}};

        controller = $controller("EmployeeCreateCtrl", {
          $state: spies.state,
          $stateParams: $stateParams
        });
      });

      describe('setup', function () {
        it('should be able to instantiate the controller', function () {
          expect(controller).to.be.ok;
        });

        it('should set saveText to the current state saveText', function () {
          expect(controller.saveText).to.equal('create');
        });
        
        it('should set the employee on scope to a non admin user', function () {
          expect(controller.employee.admin).to.be.false;
          expect(controller.employee.username).to.be.empty;
        });
      }); 

      describe('saving a new employee', function () {

        beforeEach(function () {
          $httpBackend.expect('POST', '/users');
        });

        describe('with success', function () {

          beforeEach(function () {
            $httpBackend.when('POST', '/users').respond(200, employee);
          });

          it('should transition to the employee page', function () {
            controller.save();
            $httpBackend.flush();
            expect(spies.state.go).to.have.been.calledWith('app.employees');
          });
        });
      });

    });

  });
});
