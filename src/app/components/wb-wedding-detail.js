(function () {

    "use strict";

    function WeddingDetailComponent() {
        var self = this;

        return self;
    }

    ngX.Component({
        selector: "wedding-detail",
        component: WeddingDetailComponent,        
        template: [
            "<div class='weddingDetail'>",
            "   <h1>Wedding Detail</h1>",
            "   <bid-item bid='bid' data-ng-repeat='bid in vm.wedding.bids'>",
            "   </bid-item>",
            "</div>"
        ],
        styles: [
            " .weddingDetail { ",
            " } "
        ],
        inputs: [
            'wedding'
        ]
    })
})();