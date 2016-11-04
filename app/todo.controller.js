(function(angular) {

    'use strict';

    angular
        .module('todoApp')
        .controller('TodoController', TodoController);

    TodoController.$inject = ['storageService','$mdDialog'];


    function TodoController(storageService, $mdDialog) {
        var vm = this;
        vm.taskDate = null;
        vm.taskTitle = null;
        vm.taskPriority = null;
        vm.taskDescription = null;
        vm.taskTags = [];
        vm.taskDone = null;
        vm.q=""; //used for search
        vm.taskEstimatedTime = null;
        vm.taskTime = null;
        vm.selectedItem = null;  
        vm.items = storageService.get() || [];
        vm.notDone = notDone;
        vm.done = done;
        vm.exp = exp; //expired task
        vm.all = all;
        vm.deleteItem = deleteItem;
        vm.createItem = createItem;
        vm.addTask = addTask;
        vm.closeDialog = closeDialog;
        vm.result = result;
        vm.showSearch = showSearch;
        vm.editItem = editItem;
        vm.editTask = editTask;
        vm.orderItem = orderItem;
        vm.searchMode = false;
        vm.order = 0; //type of ordination flag
        

        function notDone(item) {
             var dateNow = new Date();
             var dateTask = new Date(item.date);
            return ((item.done == false) && (dateTask >= dateNow));
        }

        function done(item) {
            return item.done == true;
        }

       //return true if task is expired
        function exp(item){
            var data = new Date();
            if(item.date < data.getTime())
                return true;
            else return false;
        }

        function all(item) {
            return true;
        }

        //Delete the current selected item, if any
        function deleteItem(ev) {

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
                            vm.selectedItem = null;       //resolved bug in deleteItem
                        }
                    }
                });
            }
        }

        //Creates a new item with the given parameters
        function createItem(title, done, priority, date, estimated, tags, description, time) {
            var id = vm.items.length;
            if(time!=null){
                date.setHours(time.getHours());
                date.setMinutes(time.getMinutes());
        }
        
            vm.items.push({
                title: title,
                done: done || false,
                priority: priority || 0,
                date: date || Date.now(),
                estimated: estimated || 0,
                tags: tags,
                description: description,
                id: id
            });
            storageService.set(vm.items);
        }


        //Add a new task to the items list 
        function addTask(ev) {

        var parentEl = angular.element(document.body);

        $mdDialog.show({
            parent: parentEl,
            targetEvent: ev,
            templateUrl: 'app/components/customPrompt.template.html',
            controller: TodoController,
            controllerAs: 'ctrl',
        }).then(function(task){

            vm.createItem(task.title, task.done, task.priority, task.date, task.estimated, task.tags, task.description, task.time);

        });
        
}
;


        function closeDialog() {
                $mdDialog.hide();
                };

        //return the task insert by user in the dialog
        function result(title, done, priority, date, estimated, tags, description, time) {
                var task = {
                    title: title,
                    done: done,
                    priority : priority,
                    date: date,
                    estimated: estimated,
                    tags: tags,
                    description: description,
                    time: time
                };

                $mdDialog.hide(task);
                };

        //manages the search mode
        function showSearch(){
                vm.searchMode = !vm.searchMode;
                if(vm.searchMode==false) vm.q ="";
            };

        //manages the edit task form    
        function editItem(ev){    
                if (vm.selectedItem != null) {
                    var sel = angular.copy(vm.selectedItem); //oggetto d'appoggio per non salvare le modifiche in tempo reale
                    var parentEl = angular.element(document.body);
                    var date = new Date(sel.date);
                    $mdDialog.show({
                        parent: parentEl,
                        targetEvent: ev,
                        templateUrl: 'app/components/customPromptEdit.template.html',
                        controller: TodoController,
                        controllerAs: 'ctrl',
                        bindToController: true,
                        locals: {
                            task: sel,
                            date: date
                        }
                    }).then(function(task){

                        vm.editTask(task);
                    });
                    
            }
        }

        //edit the task
        function editTask(task){
                vm.selectedItem.title = task.title;
                vm.selectedItem.done = task.done;
                vm.selectedItem.priority = task.priority;
                vm.selectedItem.date = task.date;
                vm.selectedItem.estimated = task.estimated;
                vm.selectedItem.tags = task.tags;
                vm.selectedItem.description = task.description;
                
                storageService.set(vm.items);

        }

        //manages the ordering of task
        function orderItem(){
            if(vm.order==0){
                vm.items.sort(function(a, b){{
                var x = a.title.toLowerCase();
                var y = b.title.toLowerCase();
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;
                }});
                vm.order = 1;
        }else if (vm.order==1){
            vm.items.sort(function(a, b){{
                var x = new Date(a.date);
                var y = new Date(b.date);
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;
                }});
                vm.order = 2;
        } else if(vm.order==2){
            vm.items.sort(function(a, b){{
                var x = a.id;
                var y = b.id;
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;
                }});
                vm.order = 0;
                }

        }
    }


})(window.angular);