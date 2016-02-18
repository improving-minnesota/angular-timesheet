angular.module('app.timesheets.controllers', [])

  .controller('TimesheetCtrl', 
    function (data) {
      var vm = this;

      // TODO : implement a function on controller to request timesheets
      vm.requestTimesheets = function requestTimesheets () {
        // Since the server expects a user_id in the request url, we can send 'all'
        // for now which will return every timesheet. 
        var query = {
          user_id: 'all'
        };

      };

      // TODO : implement a function on controller to soft delete a timesheet
      // TODO : implement a function on controller to restore a deleted timesheet
      // TODO : initialize controller by calling requestTimesheets
      
    }
  );
    