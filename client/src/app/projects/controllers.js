angular.module('app.projects.controllers', [])

  .controller('ProjectCtrl',
    function (data) {

      var vm = this;

      vm.requestProjects = function requestProjects (page) {

        data.list('projects')
          .then(function (projects) {
            vm.projects = projects;
          });
      };

      vm.remove = function remove (project) {
        data.remove('projects', project)
          .then(function (removed) {
            console.log('success !');
          })
          .catch(function (x) {
            project.deleted = false;
            console.log('error: ' + JSON.stringify(x));
          });
      };

      vm.restore = function restore (project) {

        data.restore('projects', project)
          .then(function (restored) {
            console.log('success !');
          })
          .catch(function (x) {
            project.deleted = true;
            console.log('error: ' + JSON.stringify(x));
          });
      };

      vm.requestProjects(1);
    }
  );