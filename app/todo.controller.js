(function(angular) {

    'use strict';
    

    angular.module('todoApp').controller('TodoController', TodoController);
//hgdggf ytrdrgh hjgfd
///iuuf

    //This is the application controller
    TodoController.$inject = ['storageService','$mdDialog'];
    function TodoController(storageService, $mdDialog) {
        var vm = this;

        vm.selectedItem = null;
        vm.items = storageService.get() || [];
        vm.notDone = notDone;
        vm.done = done;
        vm.all=all;
        vm.deleteItem=deleteItem;
        vm.createItem=createItem;
        vm.addTask=addTask;

        vm.notDone = function(item) {
            return item.done == false;
        }

        vm.done = function(item) {
            return item.done == true;
        }

        vm.all = function(item) {
            return true;
        }

        //Delete the current selected item, if any
        vm.deleteItem = function(ev) {

            if (vm.selectedItem != null) {
                var confirm = $mdDialog.confirm()

                .textContent('The task "' + vm.selectedItem.title + '" will be deleted. Are you sure?')
                    .ariaLabel('Delete task')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function(result) {
                    if (result) {
                        var index = vm.items.indexOf(vm.selectedItem);
                        if (index != -1) {
                            vm.items.splice(index, 1);
                            storageService.set(vm.items);
                        }
                    }
                });
            }
        }

        //Creates a new item with the given parameters
        vm.createItem = function(title, priority, done, date) {
            vm.items.push({
                title: title,
                done: done || false,
                priority: priority || 0,
                date: date || Date.now()
            });
            storageService.set(vm.items);
        }


        //Add a new task to the items list 
        vm.addTask = function(ev) {
            var confirm = $mdDialog.prompt()
                .title('Add new task')
                .placeholder('Your task title...')
                .ariaLabel('Your task title...')
                .targetEvent(ev)
                .ok('Add')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function(result) {
                if (result)
                    vm.createItem(result);
            });
        };

    }


})(window.angular);