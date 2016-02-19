angular.module('app.timesheets.timeunits.controllers', [])

  .controller('TimeunitCtrl', 
    // TODO : inject the $state and $stateParams services
    function (projects) {
      var vm = this;

      vm.projects = projects; 

      // TODO : implement a function on controller to handle cancels in child states
    }
  )

  .controller('TimeunitEditCtrl', 
    // TODO : inject the $state and $stateParams services
    function (timeunit) {
      var vm = this;

      vm.timeunit = timeunit;
      
      // TODO : implement a function on scope to update the project
    }
  )

  .controller('TimeunitCreateCtrl', 
    // TODO : inject the $state and $stateParams services
    function (data, timesheet) {
      var vm = this;
      // TODO : initialize the new timeunit with data from $stateParams
      // 1. user_id = $stateParams.user_id
      // 2. timesheet_id = $stateParams._id
      vm.timeunit = {
        dateWorked: timesheet.beginDate
      };

      // TODO : implement a function on scope to update the project and redirect to the detail state

    }
  );
    