(function() {
    'use strict';

    angular
        .module('todoApp')
        .directive('customList', customList);

    function customList() {
        return {
            scope: {},
            bindToController: {
                items: '=',
                selectedItem: '=',
                filterFunction: '=',
            },
            controller: customListController,
            controllerAs: 'customListCtrl',
            transclude: true,
            restrict: 'E',
            templateUrl: 'app/components/customList.template.html'
        };
    }
    customListController.$inject = ['storageService'];
    //Directive controller
    function customListController(storageService) {
        var vm = this;
        var vm.changePriority = changePriority ; // CONTINUARE CON LE ALTRE FUNZIONI!


        //Changes the priority of the given item
        vm.changePriority = function(item) {
            if (item.priority <= 0)
                item.priority++;
            else
                item.priority = -1;
 //creare oggetto item controller per gestone item
            storageService.set(vm.items);
        }

        //Occurs when the status of an items changes
        vm.checkStateChanged = function() {
            storageService.set(vm.items);
        }

        //Select or deselect the given item
        vm.toggleSelection = function(item) {
            if (vm.selectedItem == null || vm.selectedItem != item)
                vm.selectedItem = item;
            else
                vm.selectedItem = null;
        }
    }
})();