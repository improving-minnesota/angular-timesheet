angular.module('app.projects.controllers', [])
    
  .controller('ProjectCtrl', 
    function (data, $state, $stateParams) { 
      var vm = this;

      vm.requestProjects = function requestProjects (page) {
        
        data.list('projects')
          .then(function (projects) {
            vm.projects = projects;
          });
      };

      vm.showDetail = function showDetail (project) {
        if (project.deleted) {
          console.log('cannot view a deleted project');
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
            console.log('success !');
          })
          .catch(function (x) {
            project.deleted = false;
            console.log('error : ' + JSON.stringify(x));
          });
      };

      vm.restore = function restore (project) { 

        data.restore('projects', project) 
          .then(function (restored) {
            console.log('success !');
          })
          .catch(function (x) {
            project.deleted = true;
            console.log('error : ' + JSON.stringify(x));
          });
      };

      vm.cancel = function cancel () {
        $state.go('app.projects', {}, {reload: true});
      };

      vm.requestProjects(1);
    }
  )

  .controller('ProjectDetailCtrl', 
    function ($state, $stateParams, project) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.project = project;

      vm.save = function save () {
        vm.project.$update()
          .then(function (updated) {
            vm.project = updated;
            $state.go('app.projects', {}, {reload: true});
            console.log('success !');
          })
          .catch(function (x) {
            console.log('error : ' + JSON.stringify(x));
          });
      };
    }
  )

  .controller('ProjectCreateCtrl', 
    function ($state, $stateParams, data) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.project = {};

      vm.save = function save () {
        data.create('projects', vm.project) 
          .then(function (created) {
            $state.go('app.projects', {}, {reload: true});
            console.log('success !');
          })
          .catch(function (x) {
            console.log('error : ' + JSON.stringify(x));
          });
      };
    }
  );