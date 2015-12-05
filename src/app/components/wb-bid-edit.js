﻿(function () {

    "use strict";

    function EditBidComponent($routeParams, $location, dispatcher, bid) {
        var self = this;
        self.bid = bid;
        self.wedding = wedding;

        self.$location = $location;

        self.listenerId = dispatcher.addListener({
            actionType: "MODEL_ADDED", callback: function (options) {                
                self.$location.path("/bids");
            }
        });

        self.onDestroy = function () {

        };
        return self;
    }

    EditBidComponent.canActivate = function () {
        return [
            "$q", "$route", "appManager", "currentProfile", "weddingActions", function ($q, $route, appManager, currentProfile, weddingActions) {

                var deferred = $q.defer();

                $q.all([
                    currentProfile.createInstanceAsync(),
                    getWeddingByIdAsync({ id: Number($route.current.params.id) })
                ]).then(function (resultsArray) {
                    appManager.currentProfile = resultsArray[0];
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
            "<edit-wedding-form model='vm.wedding'></edit-wedding-form>",
            "</div>"
        ].join(" ")
    });

})();


