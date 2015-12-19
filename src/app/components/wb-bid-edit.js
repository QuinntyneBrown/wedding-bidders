(function () {

    "use strict";

    function EditBidComponent($location, $routeParams, appManager, dispatcher, weddingStore) {
        var self = this;
        self.weddingStore = weddingStore;
        self.$location = $location;
        self.wedding = self.weddingStore.getById(Number($routeParams.weddingId));

        self.listenerId = dispatcher.addListener({
            actionType: "MODEL_ADDED", callback: function (options) {                
                self.$location.path("/bids");
            }
        });

        self.onDestroy = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        };
        return self;
    }

    EditBidComponent.canActivate = function () {
        return [
            "$q", "$route", "appManager", "currentProfile", "dispatcher", "weddingActions", function ($q, $route, appManager, currentProfile, dispatcher, weddingActions) {

                var deferred = $q.defer();

                $q.all([
                    getWeddingByIdAsync({ id: Number($route.current.params.weddingId) })
                ]).then(function (resultsArray) {
                    deferred.resolve(true);
                });

                return deferred.promise;

                function getWeddingByIdAsync(options) {
                    var deferred = $q.defer();
                    var actionIds = [];
                    actionIds.push(weddingActions.getById({ id: options.id }));
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
            }
        ]
    }

    ngX.Component({
        component: EditBidComponent,
        routes: ["/bid/create/:weddingId"],
        providers: ["$location", "$routeParams", "appManager","dispatcher","weddingStore"],
        styles: [" .editWeddingComponent { padding-left:15px; } "].join(" /n "),
        template: [
            "<div class='editWeddingComponent viewComponent'>",
            "<bid-form wedding-id='vm.wedding.id'></bid-form>",
            "</div>"
        ].join(" ")
    });

})();


