angular.module('app.timesheets.controllers', [
  'timesheet.directives'
])

  .controller('TimesheetCtrl', 
    function (data, $state, $stateParams, notifications) {
      var vm = this;

      vm.requestTimesheets = function requestTimesheets (page) {

        var query = {
          user_id: $stateParams.user_id,
          page: page,
          sort: {beginDate: 1}
        };

        data.page('timesheets', query)
          .then(function (pageConfig) {
            vm.pageConfig = pageConfig;
          });
      };

      vm.showDetail = function showDetail (timesheet) {
        if (timesheet.deleted) {
          notifications.error('You cannot edit a deleted timesheet.');
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
            notifications.success('Timesheet deleted.');
          })
          .catch(function (x) {  
            timesheet.deleted = false;
            notifications.error('Error deleting timesheet : ' + x); 
          });
      };

      vm.restore = function restore (timesheet) {
        
        data.restore('timesheets', timesheet)
          .then(function (restored) {
            notifications.success('Timesheet restored.');
          })
          .catch(function (x) {
            timesheet.deleted = true;
            notifications.error('Error restoring timesheet: ' + x);
          });
      };

      vm.requestTimesheets(1);
    }
  )

  .controller('TimesheetDetailCtrl', 
    function ($state, $stateParams, data, notifications, timesheet, timeunits) {
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
          notifications.error('Cannot edit a deleted timeunit.');
          return;
        }

        $stateParams.timeunit_id = timeunit._id;
        $state.go('app.timesheets.detail.timeunits.edit', $stateParams);
      };

      vm.removeTimeunit = function removeTimeunit (timeunit) {
        timeunit.user_id = timesheet.user_id;

        data.remove('timeunits', timeunit) 
          .then(function () {
            notifications.success('Timeunit deleted.');
          })
          .catch(function (x) {
            timeunit.deleted = false;
            notifications.error('Error deleting timeunit. Timeunit restore.');
          });

          console.log("remove");
      };

      vm.restoreTimeunit = function restoreTimeunit (timeunit) {
        timeunit.user_id = timesheet.user_id;

        data.restore('timeunits', timeunit)
          .then(function (restored) {
            notifications.success('Timeunit was restored.');
          })
          .catch(function (x) {
            timeunit.deleted = true;
            notifications.error('Error restoring the timeunit.');
          });
      };

      vm.hoursRequired = function hoursRequired() {
        var daysInTimesheet = moment(vm.timesheet.endDate).diff(moment(vm.timesheet.beginDate), 'days') + 1,
          weekDays = 0;
        for (var i = 0; i < daysInTimesheet; i++) {
          switch(moment(vm.timesheet.beginDate).add('days', i).isoWeekday()) {
            case 1: case 2: case 3: case 4: case 5: 
              weekDays++;
          }
        }
        return weekDays * 8;
      };

      vm.hoursWorked = function hoursWorked() {
        return _.reduce(_.map(vm.timeunits, function (timeunit) {
          return timeunit.deleted ? 0 : timeunit.hoursWorked;
        }), function(sum, hoursWorked) {
          return sum + hoursWorked;
        });
      };

      vm.reportStatus = function reportStatus(percentComplete) {
        notifications.info('You have worked ' + percentComplete + ' of your required hours');
      };
    } 
  )

  .controller('TimesheetEditCtrl', 
    function ($state, $stateParams, data, notifications, timesheet) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.timesheet = timesheet;

      vm.save = function save () {
        vm.timesheet.$update()
          .then(function (updated) {
            vm.timesheet = updated;
            $state.go('app.timesheets.detail', $stateParams, {reload: true});
            notifications.success("Timesheet: " + vm.timesheet.name + ", was successfully updated.");
          })
          .catch(function (x) {
            notifications.error('There was an error updating timesheet : ' + vm.timesheet.name);
          });
      };

      vm.cancel = function cancel () {
        $state.go('app.timesheets.detail', $stateParams, {reload: true});
      };
    }
  )

  .controller('TimesheetCreateCtrl', 
    function ($state, $stateParams, data, notifications) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.timesheet = {};

      vm.save = function save () {
        var timesheet = angular.extend({user_id: $stateParams.user_id}, vm.timesheet);

        data.create('timesheets', timesheet)
          .then(function (created) {
            $state.go('app.timesheets.detail', {user_id: $stateParams.user_id, _id: created._id});
            notifications.success("Timesheet: " + vm.timesheet.name + ", was successfully created.");
          })
          .catch(function (x) {
            notifications.error('There was an error creating timesheet : ' + vm.timesheet.name);
          });
      };

      vm.cancel = function cancel () {
        $state.go('app.timesheets', $stateParams, {reload: true});
      };
    }
  );
    