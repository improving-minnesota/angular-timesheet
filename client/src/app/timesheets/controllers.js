angular.module('app.timesheets.controllers', [])

  .controller('TimesheetCtrl', 
    // TODO : inject $state and $stateParams services
    function (data) {
      var vm = this;

      vm.requestTimesheets = function requestTimesheets (page) {

        // TODO : assign the query's user_id to $stateParams.user_id
        var query = {};

        data.list('timesheets', query)
          .then(function (timesheets) {
            vm.timesheets = timesheets;
          });
      };

      // TODO : implement a function on controller to show the timesheet details
      // TODO : implement a function on controller to navigate to the create timesheet state

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
    // TODO : inject $state and $stateParams services
    function (data, timesheet, timeunits) {
      var vm = this;

      vm.timesheet = timesheet;
      vm.timeunits = timeunits;

      // TODO : implement a function on controller to navigate to the edit timesheet state
      // TODO : implement a function on controller to handle cancels
      // TODO : implement a function on controller to navigate to the log time state
      // TODO : implement a function on controller to navigate to a timeunit's detail state

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
    // TODO : inject $state and $stateParams services
    function (data, timesheet) {
      var vm = this;
      // TODO : set saveText on controller to the saveText assigned to the data of the current state

      vm.timesheet = timesheet;

      // TODO : implement a function on controller to update the timesheet
      // TODO : implement a function on controller to return back to the detail state on cancel and reload
    }
  )

  .controller('TimesheetCreateCtrl', 
    // TODO : inject $state and $stateParams services
    function (data) {
      var vm = this;
      // TODO : set saveText on controller to the saveText assigned to the data of the current state
      vm.timesheet = {};

      // TODO : implement a function on controller to update the timesheet and redirect to the detail state
      // TODO : implement a function on controller to navigate to the timesheet list page on cancel and reload the scope
    }
  );
    