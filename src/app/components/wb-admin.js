(function () {

    "use strict";

    function AdminComponent(customerStore, bidderStore) {
        var self = this;

        return self;
    }

    AdminComponent.canActivate = function () {
        return ["$q", "invokeAsync", "customerActions", "bidderActions", function ($q, invokeAsync, customerActions, bidderActions) {
            return $q.all([
                invokeAsync(customerActions.getAll),
                invokeAsync(bidderActions.getAll)
            ]);
        }]
    }

    ngX.Component({
        component: AdminComponent,
        route:"/admin",
        providers: ['customerStore','bidderStore'],
        template: [
            "<div class='admin viewComponent'>",
            "</div>"
        ]
    });    
})();