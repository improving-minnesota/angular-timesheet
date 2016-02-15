angular.module('app.timesheets.controllers', [])

  .controller('TimesheetCtrl',
    function (data) {

      var vm = this;

      vm.requestTimesheets = function requestTimesheets (page) {
        var query = {
          user_id: 'all'
        };

        data.list('timesheets', query)
          .then(function (timesheets) {
            vm.timesheets = timesheets;
          });
      };

      vm.remove = function remove (timesheet) {

        data.remove('timesheets', timesheet)
          .then(function () {
            console.log('success !');
          })
          .catch(function (x) {
            timesheet.deleted = false;
            console.log('error: ' + JSON.stringify(x));
          });
      };

      vm.restore = function restore (timesheet) {

        data.restore('timesheets', timesheet)
          .then(function (restored) {
            console.log('success !');
          })
          .catch(function (x) {
            timesheet.deleted = true;
            console.log('error: ' + JSON.stringify(x));
          });
      };

      vm.requestTimesheets(1);
    }
  );
