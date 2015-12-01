(function () {

    "use strict";

    function WeddingsComponent(dispatcher, weddingStore) {
        var self = this;

        self.weddings = weddingStore.weddings;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.weddings = weddingStore.weddings;
            }
        });


        self.deactivate = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }


    WeddingsComponent.prototype.canActivate = function () {
        return ["$q","dispatcher","weddingActions", function ($q,dispatcher,weddingActions) {
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
        }];
    };

    ngX.Component({
        component: WeddingsComponent,
        route: "/weddings",
        providers: ["dispatcher", "weddingStore"],
        template: [
            "<div class='weddings'>",
            "<h1>Weddings</h1>",
            "</div>"
        ].join(" ")
    });

})();


