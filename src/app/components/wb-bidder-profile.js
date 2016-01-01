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

    BidderProfileComponent.canActivate = function () {
        return ["$routeParams", "bidderActions", "invokeAsync", function ($routeParams, bidderActions, invokeAsync) {
            return invokeAsync({
                action: bidderActions.getByName,
                params: { name: $routeParams.name }
            });
        }];
    }

    ngX.Component({
        component: BidderProfileComponent,
        route: "/bidder/profile/:name",
        providers: [
            "bidderStore"
        ],
        template: [
            "<div class='bidderProfile viewComponent'>",
            "</div>"
        ]
    });
})();