angular.module('app.employees.controllers', [])
  
  .controller('EmployeeCtrl', 

    function (data, $state, $stateParams, notifications) {
      var vm = this;

      vm.requestEmployees = function requestEmployees (page) {

        data.list('employees')
          .then(function (employees) {
            vm.employees = employees;
          });
      };

      vm.showDetail = function showDetail (employee) {
        if (employee.deleted) {
          notifications.error('You cannot edit a deleted employee.');
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
            notifications.success('Employee : ' + employee.username + ', was deleted.');
          })
          .catch(function (x) {
            employee.deleted = false;
            notifications.error('Error attempting to delete employee.');
          });
      };

      vm.restore = function restore (employee) {
       
       data.restore('employees', employee)
          .then(function (restored) {
            notifications.success('Employee was restored.');
          })
          .catch(function (x) {
            employee.deleted = true;
            notifications.error('Error restoring employee.');
          });
      };

      vm.cancel = function cancel () {
        $state.go('app.employees', {}, {reload: true});
      };

      vm.requestEmployees(1);
    }
  )

  .controller('EmployeeDetailCtrl', 
    function ($state, $stateParams, notifications, employee) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.employee = employee;

      vm.save = function save () {
        vm.employee.$update()
          .then(function (updated) {
            vm.timesheet = updated;
            $state.go('app.employees', {}, {reload: true});
            notifications.success('Updated employee: ' + employee.username);            
          })
          .catch(function (x) {
            notifications.error('There was an error updating the employee.');
          });
      };
    }
  )

  .controller('EmployeeCreateCtrl', 
    function ($state, $stateParams, data, notifications) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.employee = {admin: false};

      vm.save = function save () {
        data.create('employees', vm.employee)
          .then(function (created) {
            notifications.success('Employee : ' + created.username + ', created.');
            $state.go('app.employees', {}, {reload: true});
          })
          .catch(function (x) {
            notifications.error('There was an error creating employee.');
          });
      };
    }
  );