﻿(function () {

    "use strict";

    function EditBidComponent($location, $routeParams) {
        var self = this;
        self.wedding = { id: Number($routeParams.weddingId) };
        self.successCallback = function () { $location.path("/bids"); };
        return self;
    }

    ngX.Component({
        component: EditBidComponent,
        routes: ["/bid/create/:weddingId"],
        providers: ["$location", "$routeParams"],
        styles: [" .editWeddingComponent { padding-left:15px; } "],
        template: [
            "<div class='editWeddingComponent viewComponent'>",
            "   <bid-form wedding-id='vm.wedding.id' success-callback='vm.successCallback'></bid-form>",
            "</div>"
        ]
    });
})();


