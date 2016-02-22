angular.module('app.timesheets.controllers', [])

  .controller('TimesheetCtrl', 
    // TODO : inject the notifications service
    function (data, $state, $stateParams) {
      var vm = this;

      vm.requestTimesheets = function requestTimesheets (page) {

        var query = {
          user_id: $stateParams.user_id
        };

        data.list('timesheets', query)
          .then(function (timesheets) {
            vm.timesheets = timesheets;
          });
      };

      vm.showDetail = function showDetail (timesheet) {
        if (timesheet.deleted) {
            // TODO : send an error notification using the notifications service
          return;
        }
        $state.go('app.timesheets.detail', timesheet);
      };

      vm.createNew = function createNew () {
        $state.go('app.timesheets.create', $stateParams);
      };

      vm.remove = function remove (timesheet) {

        data.remove('timesheets', timesheet)
          .then(function () {
            // TODO : send a success notification using the notifications service
          })
          .catch(function (x) {  
            timesheet.deleted = false;
            // TODO : send an error notification using the notifications service
          });
      };

      vm.restore = function restore (timesheet) {
        
        data.restore('timesheets', timesheet)
          .then(function (restored) {
            // TODO : send a success notification using the notifications service
          })
          .catch(function (x) {
            timesheet.deleted = true;
            // TODO : send an error notification using the notifications service
          });
      };

      vm.requestTimesheets(1);
    }
  )

  .controller('TimesheetDetailCtrl', 
    // TODO : inject the notifications service
    function ($state, $stateParams, data, timesheet, timeunits) {
      var vm = this;

      vm.timesheet = timesheet;
      vm.timeunits = timeunits;

      vm.edit = function edit (timesheet) {
        $state.go('app.timesheets.detail.edit', $stateParams);
      };

      vm.cancel = function cancel () {
        $state.go('app.timesheets', $stateParams, {reload: true});
      };

      vm.logTime = function logTime () {
        $state.go('app.timesheets.detail.timeunits.create', $stateParams);
      };

      vm.showTimeunitDetail = function showTimeunitDetail (timeunit) {
        if (timeunit.deleted) {
            // TODO : send an error notification using the notifications service
          return;
        }

        $stateParams.timeunit_id = timeunit._id;
        $state.go('app.timesheets.detail.timeunits.edit', $stateParams);
      };

      vm.removeTimeunit = function removeTimeunit (timeunit) {
        timeunit.user_id = timesheet.user_id;

        data.remove('timeunits', timeunit) 
          .then(function () {
            // TODO : send a success notification using the notifications service
          })
          .catch(function (x) {
            timeunit.deleted = false;
            // TODO : send an error notification using the notifications service
          });

          console.log("remove");
      };

      vm.restoreTimeunit = function restoreTimeunit (timeunit) {
        timeunit.user_id = timesheet.user_id;

        data.restore('timeunits', timeunit)
          .then(function (restored) {
            // TODO : send a success notification using the notifications service
          })
          .catch(function (x) {
            timeunit.deleted = true;
            // TODO : send an error notification using the notifications service
          });
      };
    } 
  )

  .controller('TimesheetEditCtrl', 
    // TODO : inject the notifications service
    function ($state, $stateParams, data, timesheet) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.timesheet = timesheet;

      vm.save = function save () {
        vm.timesheet.$update()
          .then(function (updated) {
            vm.timesheet = updated;
            $state.go('app.timesheets.detail', $stateParams, {reload: true});
            // TODO : send a success notification using the notifications service
          })
          .catch(function (x) {
            // TODO : send an error notification using the notifications service
          });
      };

      vm.cancel = function cancel () {
        $state.go('app.timesheets.detail', $stateParams, {reload: true});
      };
    }
  )

  .controller('TimesheetCreateCtrl', 
    // TODO : inject the notifications service
    function ($state, $stateParams, data) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.timesheet = {};

      vm.save = function save () {
        var timesheet = angular.extend({user_id: $stateParams.user_id}, vm.timesheet);

        data.create('timesheets', timesheet)
          .then(function (created) {
            $state.go('app.timesheets.detail', {user_id: $stateParams.user_id, _id: created._id});
            // TODO : send a success notification using the notifications service
          })
          .catch(function (x) {
            // TODO : send an error notification using the notifications service
          });
      };

      vm.cancel = function cancel () {
        $state.go('app.timesheets', $stateParams, {reload: true});
      };
    }
  );
    