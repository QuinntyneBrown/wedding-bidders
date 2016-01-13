(function () {

    "use strict";

    function AdminCustomerItemComponent() {
        var self = this;
        return self;
    }

    ngX.Component({
        component: AdminCustomerItemComponent,
        selector: "admin-customer-item",
        template: [
            "<div class='admin-customer-item'>",
            "   <div>{{ ::vm.customer.id }}</div>",
            "   <div>{{ ::vm.customer.firstname }} {{ ::vm.customer.firstname }}</div>",
            "   <div>{{ ::vm.customer.email }}</div>",
            "</div>"
        ],
        styles: [
            " .admin-customer-item { ",
            "   margin-bottom:15px; ",
            "   line-height:2em; ",
            " } "
        ],
        inputs: [
            'customer'
        ]
    });

})();