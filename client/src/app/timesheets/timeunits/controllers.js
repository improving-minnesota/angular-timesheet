angular.module('app.timesheets.timeunits.controllers', [])

  .controller('TimeunitCtrl', 
    function ($state, $stateParams, projects) {
      var vm = this;

      vm.projects = projects;

      vm.cancel = function cancel () {
        $state.go('app.timesheets.detail', $stateParams, {reload: true});
      };
    }
  )

  .controller('TimeunitEditCtrl', 
    function ($state, $stateParams, timeunit) {
      var vm = this;

      vm.timeunit = timeunit;
      
      vm.save = function save () {
        vm.timeunit.$update()
          .then(function (updated) {
            vm.timeunit = updated;
            $state.go('app.timesheets.detail', $stateParams, {reload: true});
            console.log('success !');
          })
          .catch(function (x) {
            console.log('error : ' + x);
            $state.reload();
          });
      };
    }
  )

  .controller('TimeunitCreateCtrl', 
    function ($state, $stateParams, data, dateFilter, timesheet) {
      var vm = this;

      vm.timeunit = {
        user_id: $stateParams.user_id,
        timesheet_id: $stateParams._id,
        dateWorked: timesheet.beginDate
      };

      vm.save = function save () {

        data.create('timeunits', vm.timeunit)
          .then(function (created) {
            $state.go('app.timesheets.detail', $stateParams, {reload: true});
            console.log('success !');
          })
          .catch(function (x) {
            console.log('error : ' + x);
          });
      };

    }
  );
    