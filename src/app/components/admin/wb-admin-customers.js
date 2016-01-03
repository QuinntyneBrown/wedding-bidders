(function () {

    "use strict";

    function AdminCustomersComponent(customerStore) {
        var self = this;
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
            "</div>"
        ]
    });
})();