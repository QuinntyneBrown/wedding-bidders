﻿(function () {

    "use strict";

    function WeddingsComponent(appManager, dispatcher, weddingStore) {
        var self = this;
        self.appManager = appManager;
        self.weddings = weddingStore.allWeddings;
        self.dispatcher = dispatcher;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.weddings = weddingStore.allWeddings;
            }
        });


        self.deactivate = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }


    WeddingsComponent.canActivate = function () {
        return ["$q", "appManager", "currentProfile", "dispatcher", "weddingActions", function ($q, appManager, currentProfile, dispatcher, weddingActions) {
            var deferred = $q.defer();

            $q.all([
                currentProfile.createInstanceAsync(),
                getAllWeddingsAsync()
            ]).then(function (resultsArray) {
                appManager.currentProfile = resultsArray[0];
                deferred.resolve(true);
            });

            function getAllWeddingsAsync() {
                var deferred = $q.defer();
                var actionIds = [];
                actionIds.push(weddingActions.getAll());
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
            return deferred.promise;
        }];
    };

    ngX.Component({
        component: WeddingsComponent,
        route: "/weddings",
        providers: ["appManager","dispatcher", "weddingStore"],
        template: [
            "<div class='weddings viewComponent'>",
            "<h1>Weddings</h1>",
            "   <div data-ng-repeat='wedding in vm.weddings'> ",
            "       <h3>Number of Guests:  {{ ::wedding.numberOfGuests }}</h3>",
            "       <h3>Hours:  {{ ::wedding.numberOfHours }}</h3>",
            "       <h3>Location:  {{ ::wedding.location }}</h3>",
            "       <h3>Bids:  {{ ::wedding.bids.length }}</h3>",
            "       <br/><br/> ",
            "   </div> ",
            "</div>"
        ].join(" ")
    });

})();


