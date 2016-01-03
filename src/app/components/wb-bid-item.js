(function () {

    "use strict";

    function BidItemComponent() {
        var self = this;

        return self;
    }

    ngX.Component({
        selector: "wedding-detail",
        component: BidItemComponent,
        template: [
            "<div class='bidItem'>",
            "</div>"
        ],
        styles: [
            " .bidItem { ",
            " } "
        ],
        inputs: [
            'bid'
        ]
    })
})();