angular.module('app.projects.controllers', [])
    
  .controller('ProjectCtrl', 
    function (data, $state, $stateParams, notifications) {
      var vm = this;

      vm.requestProjects = function requestProjects (page) {
        var query = {
          page: page,
          sort: {name: 1}
        };

        data.page('projects', query)
          .then(function (pageConfig) {
            vm.pageConfig = pageConfig;
          });
      };

      vm.showDetail = function showDetail (project) {
        if (project.deleted) {
          notifications.error('You cannot edit a deleted project.');
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
            notifications.success('Project : ' + project.name + ', was deleted.');
          })
          .catch(function (x) {
            project.deleted = false;
            notifications.error('Error attempting to delete project.');
          });
      };

      vm.restore = function restore (project) { 

        data.restore('projects', project) 
          .then(function (restored) {
            notifications.success('Project was restored.');
          })
          .catch(function (x) {
            project.deleted = true;
            notifications.error('Error restoring project.');
          });
      };

      vm.cancel = function cancel () {
        $state.go('app.projects', {}, {reload: true});
      };

      vm.requestProjects(1);
    }
  )

  .controller('ProjectDetailCtrl', 
    function ($state, $stateParams, notifications, project) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.project = project;

      vm.save = function save () {
        vm.project.$update()
          .then(function (updated) {
            vm.project = updated;
            $state.go('app.projects', {}, {reload: true});
            notifications.success('Updated project: ' + updated.name);
          })
          .catch(function (x) {
            notifications.error('There was an error updating the employee.');
          });
      };
    }
  )

  .controller('ProjectCreateCtrl', 
    function ($state, $stateParams, data, notifications) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.project = {};

      vm.save = function save () {
        data.create('projects', vm.project)
          .then(function (created) {
            $state.go('app.projects', {}, {reload: true});
            notifications.success('Project : ' + created.name + ', created.');
          })
          .catch(function (x) {
            notifications.error('There was an error creating the project.');
          });
      };
    }
  );