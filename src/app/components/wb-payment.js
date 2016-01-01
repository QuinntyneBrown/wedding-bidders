(function () {

    "use strict";

    function PaymentComponent(accountStore, profileStore) {
        var self = this;
        return self;
    }

    ngX.Component({
        component: PaymentComponent,
        providers: ["accountStore","profileStore"],
        template: [
            "<div class='paymentComponent viewComponent'>",
            "</div>"
        ]
    });
})();


