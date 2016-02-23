angular.module('app.projects.controllers', [])
    
  .controller('ProjectCtrl', 
    function (data, $state, $stateParams) { // TODO : inject the notifications service
      var vm = this;

      vm.requestProjects = function requestProjects (page) {
        
        data.list('projects')
          .then(function (projects) {
            vm.projects = projects;
          });
      };

      vm.showDetail = function showDetail (project) {
        if (project.deleted) {
          // TODO : Send a notification to the user that they cannot view a deleted project
          return;
        }
        $state.go('app.projects.detail', project);
      };

      vm.createNew = function createNew () {
        $state.go('app.projects.create', $stateParams);
      };

      vm.remove = function remove (project) {
        data.remove('projects', project)
          .then(function (removed) {
            // TODO : send a success notification using the notifications service
          })
          .catch(function (x) {
            project.deleted = false;
            // TODO : send an error notification using the notifications service
          });
      };

      vm.restore = function restore (project) { 

        data.restore('projects', project) 
          .then(function (restored) {
            // TODO : send a success notification using the notifications service
          })
          .catch(function (x) {
            project.deleted = true;
            // TODO : send an error notification using the notifications service
          });
      };

      vm.cancel = function cancel () {
        $state.go('app.projects', {}, {reload: true});
      };

      vm.requestProjects(1);
    }
  )

  .controller('ProjectDetailCtrl', 
    // TODO : inject the notifications service
    function ($state, $stateParams, project) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.project = project;

      vm.save = function save () {
        vm.project.$update()
          .then(function (updated) {
            vm.project = updated;
            $state.go('app.projects', {}, {reload: true});
            // TODO : send a success notification using the notifications service
          })
          .catch(function (x) {
            // TODO : send an error notification using the notifications service
          });
      };
    }
  )

  .controller('ProjectCreateCtrl', 
    // TODO : inject the notifications service
    function ($state, $stateParams, data) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.project = {};

      vm.save = function save () {
        data.create('projects', vm.project)
          .then(function (created) {
            $state.go('app.projects', {}, {reload: true});
            // TODO : send a success notification using the notifications service
          })
          .catch(function (x) {
            // TODO : send an error notification using the notifications service
          });
      };
    }
  );