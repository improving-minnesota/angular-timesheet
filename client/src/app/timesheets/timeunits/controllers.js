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
    function ($state, $stateParams, timeunit) { // TODO : inject the notifications service
      var vm = this;

      vm.timeunit = timeunit;
      
      vm.save = function save () {
        vm.timeunit.$update()
          .then(function (updated) {
            vm.timeunit = updated;
            $state.go('app.timesheets.detail', $stateParams, {reload: true});
            // TODO : send a success notification using the notifications service
          })
          .catch(function (x) {
            // TODO : send an error notification using the notifications service
            $state.reload();
          });
      };
    }
  )

  .controller('TimeunitCreateCtrl', 
    function ($state, $stateParams, data, dateFilter, timesheet) { // TODO : inject the notifications service
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
            // TODO : send a success notification using the notifications service
          })
          .catch(function (x) {
            // TODO : send an error notification using the notifications service
          });
      };

    }
  );
    