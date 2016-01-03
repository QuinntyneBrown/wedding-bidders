(function () {

    "use strict";

    function AdminBidderComponent() {
        var self = this;
        return self;
    }

    ngX.Component({
        component: AdminBidderComponent,
        selector: "admin-bidder",
        template: [
            "<div class='adminBidder'>",
            "</div>"
        ],
        style: [
            " .adminBidder { ",
            " } "
        ],
        inputs: ['bidder']
    });

})();