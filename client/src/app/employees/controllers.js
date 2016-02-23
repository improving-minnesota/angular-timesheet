angular.module('app.employees.controllers', [])
  
  .controller('EmployeeCtrl', 
    // TODO : inject $state and $stateParams
    function (data) {
      var vm = this;

      vm.requestEmployees = function requestEmployees (page) {

        data.list('employees')
          .then(function (employees) {
            vm.employees = employees;
          });
      };

      // TODO : implement a function on controller to show the detail of an employee
      // TODO : implement a function on controller to navigate to the create employee state
      // TODO : implement a function on controller to handle cancel for child states

      vm.remove = function remove (employee) {

        data.remove('employees', employee) 
          .then(function () {
            console.log('success!');
          })
          .catch(function (x) {
            employee.deleted = false;
            console.log('error : ' + JSON.stringify(x));
          });
      };

      vm.restore = function restore (employee) {
       
       data.restore('employees', employee)
          .then(function (restored) {
            console.log('success!');
          })
          .catch(function (x) {
            employee.deleted = true;
            console.log('error : ' + JSON.stringify(x));
          });
      };

      vm.requestEmployees(1);
    }
  )

  .controller('EmployeeDetailCtrl', 
    // TODO : inject $state and $stateParams
    function (employee) {
      var vm = this;
      // TODO : set saveText on controller to the saveText assigned to the data of the current state

      vm.employee = employee;

      // TODO : implement a function on controller to update the employee
    }
  )

  .controller('EmployeeCreateCtrl', 
    // TODO : inject $state and $stateParams
    function (data) {
      var vm = this;
      // TODO : set saveText on controller to the saveText assigned to the data of the current state

      vm.employee = {admin: false};

      // TODO : implement a function on controller to update the employee and redirect to the detail state
    }
  );