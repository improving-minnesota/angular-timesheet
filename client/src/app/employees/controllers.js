angular.module('app.employees.controllers', [])
  
  .controller('EmployeeCtrl', 
    function (data, $state, $stateParams) { // TODO : inject the notifications service
      var vm = this;

      vm.requestEmployees = function requestEmployees (page) {

        data.list('employees')
          .then(function (employees) {
            vm.employees = employees;
          });
      };

      vm.showDetail = function showDetail (employee) {
        if (employee.deleted) {
          // TODO : send a notification alerting the user they cannot view a deleted employee
          return;
        }
        $state.go('app.employees.detail', employee);
      };  

      vm.createNew = function createNew () {
        $state.go('app.employees.create', $stateParams);
      };

      vm.remove = function remove (employee) {

        data.remove('employees', employee) 
          .then(function () {
            // TODO : send a success notification using the notifications service
          })
          .catch(function (x) {
            employee.deleted = false;
            // TODO : send an error notification to the users
          });
      };

      vm.restore = function restore (employee) {
       
       data.restore('employees', employee)
          .then(function (restored) {
            // TODO : send a success notification 
          })
          .catch(function (x) {
            employee.deleted = true;
            // TODO : send an error notification
          });
      };

      vm.cancel = function cancel () {
        $state.go('app.employees', {}, {reload: true});
      };

      vm.requestEmployees(1);
    }
  )

  .controller('EmployeeDetailCtrl', 
    // TODO : inject the notifications service
    function ($state, $stateParams, employee) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.employee = employee;

      vm.save = function save () {
        vm.employee.$update()
          .then(function (updated) {
            vm.timesheet = updated;
            $state.go('app.employees', {}, {reload: true});
            // TODO : send a success notification
          })
          .catch(function (x) {
            // TODO : send an error notification
          });
      };
    }
  )

  .controller('EmployeeCreateCtrl', 
    // TODO : inject the notifications service
    function ($state, $stateParams, data) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.employee = {admin: false};

      vm.save = function save () {
        data.create('employees', vm.employee)
          .then(function (created) {
            // TODO : send a success notification
            $state.go('app.employees', {}, {reload: true});
          })
          .catch(function (x) {
            // TODO : send an error notification
          });
      };
    }
  );