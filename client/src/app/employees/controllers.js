angular.module('app.employees.controllers', [])
  
  .controller('EmployeeCtrl', 
    function (data, $state, $stateParams) {
      var vm = this;

      vm.requestEmployees = function requestEmployees (page) {

        data.list('employees')
          .then(function (employees) {
            vm.employees = employees;
          });
      };

      vm.showDetail = function showDetail (employee) {
        if (employee.deleted) {
          console.log('cannot view a deleted employee');
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
            console.log('success!');
          })
          .catch(function (x) {
            employee.deleted = false;
            console.log('error : ' + x);
          });
      };

      vm.restore = function restore (employee) {
       
       data.restore('employees', employee)
          .then(function (restored) {
            console.log('success!');
          })
          .catch(function (x) {
            employee.deleted = true;
            console.log('error : ' + x);
          });
      };

      vm.cancel = function cancel () {
        $state.go('app.employees', {}, {reload: true});
      };

      vm.requestEmployees(1);
    }
  )

  .controller('EmployeeDetailCtrl', 
    function ($state, $stateParams, employee) {
      var vm = this;

      vm.saveText = $state.current.data.saveText;
      vm.employee = employee;

      vm.save = function save () {
        vm.employee.$update()
          .then(function (updated) {
            vm.timesheet = updated;
            $state.go('app.employees', {}, {reload: true});
            console.log('success!');
          })
          .catch(function (x) {
            console.log('error : ' + x);
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
            console.log('success!');
            $state.go('app.employees', {}, {reload: true});
          })
          .catch(function (x) {
            console.log('error : ' + x);
          });
      };
    }
  );