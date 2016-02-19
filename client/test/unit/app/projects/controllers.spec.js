describe('Projects', function() {

  var expect = chai.expect;
  var $controller,
    $httpBackend,
    $state,
    $stateParams,
    controller, 
    project,
    spies,
    api;
 
  describe('Controllers:', function() {
      
    beforeEach(
      module(
        'ui.router',
        'app.resources',
        'ngResource',
        'security.services',
        'notifications.services',
        'app.projects',
        'app.projects.controllers'
      ));

    beforeEach(inject(function (_$httpBackend_, _$controller_, _$state_, _$stateParams_){
      $httpBackend = _$httpBackend_;
      $controller = _$controller_;
      $state = _$state_;
      $stateParams = _$stateParams_;
    }));

    beforeEach(inject(function ($injector) {
      var notifications = $injector.get('notifications');

      api = $injector.get('api');

      spies = {
        error: sinon.spy(notifications, 'error'),
        success: sinon.spy(notifications, 'success'),
        state: sinon.stub($state)
      };

      project = {
        "_id": "abcdefghijklmnop",
        "name": "Project2", 
        "description": "This is your second project"
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('ProjectCtrl', function() {

      beforeEach(function() {
        controller = $controller("ProjectCtrl", { 
          $state: spies.state,
          $stateParams: $stateParams 
        });
        
        $httpBackend.when('GET', '/projects').respond(200, [{name: 'project1'}]);
      });

      describe('during setup', function () {
        it('should be able to instantiate the controller and request a page of projects', function () { 
          expect(controller).to.be.ok; 
          // controller.requestProjects is called upon controller creation
          $httpBackend.expect('GET', '/projects');
          $httpBackend.flush();
        });
      }); 

      describe('requesting projects', function () {
        it('should set the result to the pageConfig object', function () {
          $httpBackend.expect('GET', '/projects');
          controller.requestProjects();
          $httpBackend.flush();
          expect(controller.projects[0].name).to.equal("project1");
        }); 
      });

      describe('showing project detail', function () {
        it('should notify the user if the project is deleted', function () {
          project.deleted = true;
          $httpBackend.flush();
          controller.showDetail(project);
          expect(spies.error).to.have.been.calledWith('You cannot edit a deleted project.');
        });
        it('should transition to the project detail state', function () {
          $httpBackend.flush();
          controller.showDetail(project);
          expect(spies.state.go).to.have.been.calledWith('app.projects.detail', project);
        });
      });

      describe('creating a new project', function () {
        it('should transition to the create project state', function () {
          $httpBackend.flush();
          controller.createNew();
          expect(spies.state.go).to.have.been.calledWith('app.projects.create');
        });
      });

      describe('removing a project', function () {

        it('should send a remove request for the specified project', function () {
          $httpBackend.flush();
          $httpBackend.expect('PUT', '/projects/' + project._id).respond(200);
          controller.remove(project);
          $httpBackend.flush();
        });

        describe('successfully', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/projects/' + project._id).respond(200);
          });

          it('should set the project to deleted for the ui', function () {
            controller.remove(project);
            $httpBackend.flush();
            expect(project.deleted).to.be.true;
          });
          it('should notify the user of the deletion', function () {
            controller.remove(project);
            $httpBackend.flush();
            expect(spies.success).to.have.been.called;
            expect(spies.error).to.not.have.been.called;
          });
        });

        describe('in error', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/projects/' + project._id).respond(500);
          });

          it('should set deleted to false for the project in the ui', function () {
            controller.remove(project);
            $httpBackend.flush();
            expect(project.deleted).to.be.false;
          });
          it('should notify the user of the error', function () {
            controller.remove(project);
            $httpBackend.flush();
            expect(spies.error).to.have.been.called;
            expect(spies.success).to.not.have.been.called;
          });
        });

      });

      describe('restore', function () {
        beforeEach(function () {
          project.deleted = true;
        });

        it('should send a restore request for the specified project', function () {
          $httpBackend.flush();
          $httpBackend.expect('PUT', '/projects/' + project._id).respond(200);
          controller.restore(project);
          $httpBackend.flush();
        });

        describe('successfully', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/projects/' + project._id).respond(200);
          });

          it('should set the project to not deleted for the ui', function () {
            controller.restore(project);
            $httpBackend.flush();
            expect(project.deleted).to.be.false;
          });
          it('should notify the user of the deletion', function () {
            controller.restore(project);
            $httpBackend.flush();
            expect(spies.success).to.have.been.called;
            expect(spies.error).to.not.have.been.called;
          });
        });

        describe('in error', function () {
          beforeEach(function () {
            $httpBackend.flush();
            $httpBackend.when('PUT', '/projects/' + project._id).respond(500);
          });

          it('should set deleted to true for the project in the ui', function () {
            controller.restore(project);
            $httpBackend.flush();
            expect(project.deleted).to.be.true;
          });
          it('should notify the user of the error', function () {
            controller.restore(project);
            $httpBackend.flush();
            expect(spies.error).to.have.been.called;
            expect(spies.success).to.not.have.been.called;
          });
        });
      });

      describe('cancel', function () {
        it('should return back to the project list', function () {
          $httpBackend.flush();
          controller.cancel();
          expect(spies.state.go).to.have.been.calledWith('app.projects');
        });
      });

    });

    describe('ProjectDetailCtrl', function() {
      
      beforeEach(function() {
        $state.current = {data: {saveText: 'update'}};

        controller = $controller("ProjectDetailCtrl", {
          project: new api.projects(project),
          $state: spies.state,
          $stateParams: $stateParams
        });
      });

      describe('setup', function () {
        it('should be able to instantiate the controller', function () {
          expect(controller).to.be.ok;
        });

        it('should set saveText to the current state saveText', function () {
          expect(controller.saveText).to.equal('update');
        });

        it('should set the project on scope to the resolved project', function () {
          expect(controller.project._id).to.equal(project._id);
          expect(controller.project.name).to.equal(project.name);
        });
      });

      describe('Saving an edited project', function () {
        var updatedProject;

        beforeEach(function () {
          updatedProject = angular.extend(project, {name: 'updated project'});
          $httpBackend.expect('PUT', '/projects/' + project._id);
        });

        describe('with success', function () {

          beforeEach(function () {
            $httpBackend.when('PUT', '/projects/' + project._id).respond(200, updatedProject);
          });

          it('should set the project on scope to be the updated project', function () {
            controller.save();
            $httpBackend.flush();
            expect(controller.project.name).to.equal(updatedProject.name);
          });

          it('should notify the user of the successful update', function () {
            controller.save();
            $httpBackend.flush();
            expect(spies.success).to.have.been.called;
            expect(spies.error).to.not.have.been.called;
          });
        });

        describe('in error', function () {
          it('should notify the user of the error', function () {
            $httpBackend.when('PUT', '/projects/' + project._id).respond(500);
            controller.save();
            $httpBackend.flush();
            expect(spies.error).to.have.been.called;
            expect(spies.success).to.not.have.been.called;
          });
        });

      });
    });

    describe('ProjectCreateCtrl', function() {

      beforeEach(function() {
        $state.current = {data: {saveText: 'create'}};

        controller = $controller("ProjectCreateCtrl", {
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
        
        it('should set the project on scope to an empy object', function () {
          expect(controller.project).to.be.empty;
        });
      }); 

      describe('saving a new project', function () {

        beforeEach(function () {
          $httpBackend.expect('POST', '/projects');
        });

        describe('with success', function () {

          beforeEach(function () {
            $httpBackend.when('POST', '/projects').respond(200, project);
          });

          it('should transition to the project page', function () {
            controller.save();
            $httpBackend.flush();
            expect(spies.state.go).to.have.been.calledWith('app.projects');
          });

          it('should notify the user of the successful create', function () {
            controller.save();
            $httpBackend.flush();
            expect(spies.success).to.have.been.called;
            expect(spies.error).to.not.have.been.called;
          });
        });

        describe('in error', function () {
          it('should notify the user of the error', function () {
            $httpBackend.when('POST', '/projects').respond(500);
            controller.save();
            $httpBackend.flush();
            expect(spies.error).to.have.been.called;
            expect(spies.success).to.not.have.been.called;
          });
        });
      });

    });

  });
});