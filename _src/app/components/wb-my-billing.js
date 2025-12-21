(function () {

    "use strict";

    function MyBillingComponent() {
        var self = this;

        return self;
    }

    ngX.Component({
        component: MyBillingComponent,
        route: "/myBilling",
        providers: [],
        template: [
            "<div class='myBilling'>",
            "</div>"
        ]
    });
})();