(function () {

    "use strict";

    function CatererComponent($routeParams, dispatcher, catererStore) {
        var self = this;
        self.caterer = catererStore.getById(Number($routeParams.id));
        return self;
    }

    CatererComponent.canActivate = function () {
        return [
            "$q", "$route", "catererActions", "dispatcher", function ($q, $route, catererActions, dispatcher) {

                var deferred = $q.defer();
                var actionIds = [];
                actionIds.push(catererActions.getById({ id: Number($route.current.params.id) }));
                var listenerId = dispatcher.addListener({
                    actionType: "CHANGE",
                    callback: function (options) {
                        for (var i = 0; i < actionIds.length; i++) {
                            if (actionIds[i] === options.id) {
                                actionIds.splice(i, 1);
                            }
                        }

                        if (actionIds.length === 0) {
                            dispatcher.removeListener({ id: listenerId });
                            deferred.resolve();
                        }

                    }
                });
                return deferred.promise;
            }
        ]
    }

    ngX.Component({
        component: CatererComponent,
        route:"/caterer/:id",
        providers: ["$routeParams", "dispatcher", "catererStore"],
        template: [
            "<div class='caterer viewComponent'>",
            "<h1>{{ vm.caterer.firstname }}  {{ vm.caterer.lastname }}</h1><br/><br/>",
            "</div>"
        ]
    });
})();