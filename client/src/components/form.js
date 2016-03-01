angular.module('form.components', [])

.component('tszFormSectionHeader', {
  bindings: {
    header: '@'
  },
  replace: true,
  transclude: true,
  templateUrl: 'assets/templates/components/form/form-header.html'
});
