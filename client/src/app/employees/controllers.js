angular.module('app.employees.controllers', [])

  .controller('EmployeeCtrl',
    function (data) {

      var vm = this;

      vm.requestEmployees = function requestEmployees (page) {

        data.list('employees')
          .then(function (employees) {
            vm.employees = employees;
          });
      };

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
  );