angular.module('app.projects.controllers', [])
    
  .controller('ProjectCtrl', 
    function (data, $scope, $state, $stateParams, notifications) {

      $scope.requestProjects = function requestProjects (page) {
        var query = {
          page: page || $scope.pageConfig.page,
          sort: {name: 1}
        };

        data.page('projects', query)
          .then(function (pageConfig) {
            $scope.pageConfig = pageConfig;
          });
      };

      $scope.showDetail = function showDetail (project) {
        if (project.deleted) {
          notifications.error('You cannot edit a deleted project.');
          return;
        }
        $state.go('app.projects.detail', project);
      };

      $scope.createNew = function createNew () {
        $state.go('app.projects.create', $stateParams);
      };

      $scope.remove = function remove (project) {
        data.remove('projects', project)
          .then(function (removed) {
            notifications.success('Project : ' + project.name + ', was deleted.');
          })
          .catch(function (x) {
            project.deleted = false;
            notifications.error('Error attempting to delete project.');
          });
      };

      $scope.restore = function restore (project) { 

        data.restore('projects', project) 
          .then(function (restored) {
            notifications.success('Project was restored.');
          })
          .catch(function (x) {
            project.deleted = true;
            notifications.error('Error restoring project.');
          });
      };

      $scope.cancel = function cancel () {
        $state.go('app.projects', {}, {reload: true});
      };

      $scope.requestProjects(1);
    }
  )

  .controller('ProjectDetailCtrl', 
    function ($scope, $state, $stateParams, notifications, project) {
      $scope.saveText = $state.current.data.saveText;
      $scope.project = project;

      $scope.save = function save () {
        $scope.project.$update()
          .then(function (updated) {
            $scope.project = updated;
            notifications.success('Updated project: ' + updated.name);
          })
          .catch(function (x) {
            notifications.error('There was an error updating the employee.');
          });
      };
    }
  )

  .controller('ProjectCreateCtrl', 
    function ($scope, $state, $stateParams, data, notifications) {
      $scope.saveText = $state.current.data.saveText;
      $scope.project = {};

      $scope.save = function save () {
        data.create('projects', $scope.project) 
          .then(function (created) {
            $state.go('app.projects.detail', {_id: created._id});
            notifications.success('Project : ' + created.name + ', created.');
          })
          .catch(function (x) {
            notifications.error('There was an error creating the project.');
          });
      };
    }
  );