(function () {

    "use strict";

    function AdminCustomerComponent() {
        var self = this;
        return self;
    }

    ngX.Component({
        component: AdminCustomerComponent,
        selector: "admin-customer",
        template: [
            "<div class='adminCustomer'>",
            "</div>"
        ],
        style: [
            " .adminCustomer { ",
            " } "
        ],
        inputs: ['customer']
    });

})();