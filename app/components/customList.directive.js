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
                sfunction: '=',
                
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
        vm.changePriority = changePriority;
        vm.checkStateChanged = checkStateChanged;
        vm.toggleSelection = toggleSelection


        //Changes the priority of the given item
        function changePriority(item) {
            if (item.priority <= 0)
                item.priority++;
            else
                item.priority = -1;

            storageService.set(vm.items);
        }

        //Occurs when the status of an items changes
        function checkStateChanged() {
            storageService.set(vm.items);
        }

        //Select or deselect the given item
        function toggleSelection(item) {
            if (vm.selectedItem == null || vm.selectedItem != item)
                vm.selectedItem = item;
            else
                vm.selectedItem = null;
        }
    }
})();