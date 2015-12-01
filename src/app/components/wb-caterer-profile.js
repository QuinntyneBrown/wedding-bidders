(function () {

    "use strict";

    function CatererProfileComponent($routeParams, catererStore) {
        var self = this;
        self.caterer = catererStore.getByName({ name: $routeParams.name});

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.caterer = catererStore.getByName({ name: $routeParams.name });
            }
        });

        self.dispose = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }

    CatererProfileComponent.prototype.canActivate = function () {
        return ["$q", "$routeParams", "dispatcher", "catererActions", "catererStore", function ($q, $routeParams, dispatcher, catererActions, catererStore) {

            var deferred = $q.defer();
            var actionIds = [];
            var catererName = $routeParams.name;

            actionIds.push(catererActions.getCatererByName({ name: catererName }));

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
        }];
    }

    ngX.Component({
        component: CatererProfileComponent,
        route: "/caterer/profile/:name",
        providers: [
            "catererStore"],
        template: [
            "<div class='catererProfile viewComponent'>",
            "</div>"
        ].join(" ")
    });

})();