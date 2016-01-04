(function () {

    "use strict";

    function BidItemComponent() {
        var self = this;

        return self;
    }

    ngX.Component({
        selector: "bid-item",
        component: BidItemComponent,
        template: [
            "<div class='bidItem'>",
            "   <h1>{{ ::vm.bid.price }}</h1>",
            "   <p>{{ ::vm.bid.description }}</p>",
            "</div>"
        ],
        styles: [
            " .bidItem { ",
            "   display:block; ",
            "   margin:15px; ",
            " } "
        ],
        inputs: [
            'bid'
        ]
    })
})();