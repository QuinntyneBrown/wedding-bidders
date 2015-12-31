(function () {

    "use strict";

    function BidsComponent(bidStore) {
        var self = this;
        self.bids = bidStore.byProfile;
        return self;
    }

    BidsComponent.canActivate = function () {
        return ["bidActions", function (bidActions) {
            return bidActions.getAllByCurrentProfileAsync();
        }];
    };  

    ngX.Component({
        component: BidsComponent,
        route: "/bids",
        providers: ["bidStore"],
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


