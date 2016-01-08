(function () {

    "use strict";

    function BidderProfileComponent($routeParams, bidder, bidderStore) {
        var self = this;
        
        self.onInit = function () {
            self.bidder = bidder.createInstance({
                data: bidderStore.getById(Number($routeParams.id))
            });
        }

        self.storeOnChange = function () {

        }

        return self;
    }

    BidderProfileComponent.canActivate = function () {
        return ["$route", "bidderActions", "invokeAsync", function ($route, bidderActions, invokeAsync) {
            return invokeAsync({
                action: bidderActions.getById,
                params: { id: $route.current.params.id }
            });
        }];
    }

    ngX.Component({
        component: BidderProfileComponent,
        route: "/bidder/profile/:id",
        providers: [
            "$routeParams", "bidder", "bidderStore"
        ],
        template: [
            "<div class='bidderProfile viewComponent'>",
            "   <div>{{ vm.bidder.firstname }}  {{ vm.bidder.lastname }}</div>",
            "</div>"
        ]
    });
})();