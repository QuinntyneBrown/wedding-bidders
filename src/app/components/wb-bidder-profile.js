(function () {

    "use strict";

    function BidderProfileComponent($routeParams, bidderStore) {
        var self = this;
        self.bidder = bidderStore.getByName({ name: $routeParams.name });

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.caterer = bidderStore.getByName({ name: $routeParams.name });
            }
        });

        self.dispose = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }

    BidderProfileComponent.prototype.canActivate = function () {
        return ["$q", "$routeParams", "dispatcher", "bidderActions", "bidderStore", function ($q, $routeParams, dispatcher, bidderActions, bidderStore) {

            var deferred = $q.defer();
            var actionIds = [];
            var name = $routeParams.name;

            actionIds.push(bidderActions.getByName({ name: name }));

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
        component: BidderProfileComponent,
        route: "/bidder/profile/:name",
        providers: [
            "bidderStore"],
        template: [
            "<div class='bidderProfile viewComponent'>",
            "</div>"
        ].join(" ")
    });

})();