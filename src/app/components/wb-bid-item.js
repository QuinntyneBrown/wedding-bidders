﻿(function () {

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
            "   <p>Bidder: {{ ::vm.bid.bidder.firstname + ' ' + vm.bid.bidder.lastname }}</p> ",
            "   <p><a class='bidItem-profileLink' data-ng-href='#/bidder/profile/{{ ::vm.bid.bidder.id }}'>View Profile</a></p> ",
            "   <p><a class='bidItem-messageLink' data-ng-href='#/messages/{{ ::vm.bid.bidder.profile.id }}'>Messages</a></p> ",
            "   <p>Quoted Price: {{ ::vm.bid.price }}</p>",
            "   <p>Description: {{ ::vm.bid.description }}</p>",
            "</div>"
        ],
        styles: [
            " .bidItem { ",
            "   display:block; ",
            "   margin:15px; ",
            "   padding:15px; ",
            " } ",

            " .bidItem { ",
            "   line-height: 30px; ",
            " } ",

            " .bidItem-profileLink { ",
            "   text-decoration: none; cursor:pointer; color: #000; ",
            " } ",

            " .bidItem-messageLink { ",
            "   text-decoration: none; cursor:pointer; color: #000; ",
            " } "

        ],
        inputs: [
            'bid'
        ]
    });
})();