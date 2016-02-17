angular.module('app.timesheets.controllers', [])

  .controller('TimesheetCtrl', 
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
          console.log('error : cannot view a deleted timesheet');
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
            console.log('success !');
          })
          .catch(function (x) {  
            timesheet.deleted = false;
            console.log('error ' + JSON.stringify(x));
          });
      };

      vm.restore = function restore (timesheet) {
        
        data.restore('timesheets', timesheet)
          .then(function (restored) {
            console.log('success !');
          })
          .catch(function (x) {
            timesheet.deleted = true;
            console.log('error ' + JSON.stringify(x));
          });
      };

      vm.requestTimesheets(1);
    }
  )

  .controller('TimesheetDetailCtrl', 
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
            console.log('error ' + x);
          return;
        }

        $stateParams.timeunit_id = timeunit._id;
        $state.go('app.timesheets.detail.timeunits.edit', $stateParams);
      };

      vm.removeTimeunit = function removeTimeunit (timeunit) {
        timeunit.user_id = timesheet.user_id;

        data.remove('timeunits', timeunit) 
          .then(function () {
            console.log('success !');
          })
          .catch(function (x) {
            timeunit.deleted = false;
            console.log('error ' + JSON.stringify(x));
          });

          console.log("remove");
      };

      vm.restoreTimeunit = function restoreTimeunit (timeunit) {
        timeunit.user_id = timesheet.user_id;

        data.restore('timeunits', timeunit)
          .then(function (restored) {
            console.log('success !');
          })
          .catch(function (x) {
            timeunit.deleted = true;
            console.log('error ' + JSON.stringify(x));
          });
      };
    } 
  )

  .controller('TimesheetEditCtrl', 
    function ($state, $stateParams, data, timesheet) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.timesheet = timesheet;

      vm.save = function save () {
        vm.timesheet.$update()
          .then(function (updated) {
            vm.timesheet = updated;
            $state.go('app.timesheets', $stateParams, {reload: true});
            console.log('success !');
          })
          .catch(function (x) {
            console.log('error ' + JSON.stringify(x));
          });
      };

      vm.cancel = function cancel () {
        $state.go('app.timesheets.detail', $stateParams, {reload: true});
      };
    }
  )

  .controller('TimesheetCreateCtrl', 
    function ($state, $stateParams, data) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.timesheet = {};

      vm.save = function save () {
        var timesheet = angular.extend({user_id: $stateParams.user_id}, vm.timesheet);

        data.create('timesheets', timesheet)
          .then(function (created) {
            $state.go('app.timesheets', $stateParams, {reload: true});
            console.log('success !');
          })
          .catch(function (x) {
            console.log('error ' + JSON.stringify(x));
          });
      };

      vm.cancel = function cancel () {
        $state.go('app.timesheets', $stateParams, {reload: true});
      };
    }
  );
    