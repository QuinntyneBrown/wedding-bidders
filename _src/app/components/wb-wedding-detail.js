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
            "   <h1 class='weddingDetail-heading'>Wedding Detail</h1>",
            "   <bid-item bid='bid' data-ng-repeat='bid in vm.wedding.bids'ng-class-odd=\"'bidItemOdd'\">",
            "   </bid-item>",
            "</div>"
        ],
        styles: [
            " .weddingDetail-container { ",
            "   padding: 15px; ",
            " } ",
            " .bidItemOdd { background-color:#CCC; } ",
            " .weddingDetail-heading { padding-left:15px; } "

        ],
        inputs: [
            'wedding'
        ]
    });
})();