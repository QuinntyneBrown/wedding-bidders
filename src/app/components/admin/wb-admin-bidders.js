(function () {

    "use strict";

    function AdminBiddersComponent(bidderStore) {
        var self = this;
        self.bidders = bidderStore.items;
        return self;
    }

    AdminBiddersComponent.canActivate = function () {
        return ["$q", "invokeAsync", "bidderActions", function ($q, invokeAsync, bidderActions) {
            return $q.all([
                invokeAsync(bidderActions.getAll)
            ]);
        }]
    }

    ngX.Component({
        component: AdminBiddersComponent,
        route: "/admin/bidders",
        providers: ['bidderStore'],
        template: [
            "<div class='adminBidders viewComponent'>",
            "   <div data-ng-repeat='bidder in vm.bidders'> ",
            "       <p>{{ bidder.id }}</p> ",
            "   </div> ",
            "</div>"
        ]
    });
})();