(function () {

    "use strict";

    ngX.Component({
        selector: "bid-form",
        component: function BidFormComponent(bidActions) {
            var self = this;
            self.bidActions = bidActions;

            self.tryToBid = function () {

            };

            return self;
        },
        providers: [
            "bidActions"
        ],
        styles: [
            ".bidForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ],
        template: [
            "<form class='bidForm' name='bidForm'>",
            "   <button data-ng-click='vm.tryToRegister()'>Register</button>",
            "</form>"
        ].join(" ")
    });

})();