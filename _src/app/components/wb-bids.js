(function () {

    "use strict";

    function BidsComponent(bid, bidStore) {
        var self = this;
        self.bids = [];
        for(var i = 0; i < bidStore.byProfile.length; i++) {
            self.bids.push(bid.createInstance({ data: bidStore.byProfile[i]}));
        }

        return self;
    }

    BidsComponent.canActivate = function () {
        return ["invokeAsync", "bidActions", function (invokeAsync, bidActions) {
            return invokeAsync(bidActions.getAllByCurrentProfile);
        }];
    };  

    ngX.Component({
        component: BidsComponent,
        route: "/bids",
        providers: ["bid", "bidStore"],
        template: [
            "<div class='bids viewComponent'>",
            "<h1>Bids</h1>",
            "   <div data-ng-repeat='bid in vm.bids'> ",
            "       <h3>Wedding Id: {{ ::bid.weddingId }}</h3>",
            "       <h3>Price: {{ ::bid.price }}</h3>",
            "       <h3>Description: {{ ::bid.description }}</h3>",
            "       <br/><br/> ",
            "   </div> ",
            "</div>"
        ]
    });
})();


