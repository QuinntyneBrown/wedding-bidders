(function () {

    "use strict";

    function AdminCustomersComponent(customerStore) {
        var self = this;
        self.customers = customerStore.items;
        return self;
    }

    AdminCustomersComponent.canActivate = function () {
        return ["$q", "invokeAsync", "customerActions", function ($q, invokeAsync, customerActions) {
            return $q.all([
                invokeAsync(customerActions.getAll)
            ]);
        }]
    }

    ngX.Component({
        component: AdminCustomersComponent,
        route: "/admin/customers",
        providers: ['customerStore'],
        template: [
            "<div class='adminCustomers viewComponent'>",
            "   <admin-customer-item customer='customer' data-ng-repeat='customer in vm.customers'> ",
            "   </admin-customer-item>",
            "</div>"
        ]
    });
})();