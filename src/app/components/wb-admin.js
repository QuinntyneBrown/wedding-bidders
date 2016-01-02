(function () {

    "use strict";

    function AdminComponent(customerStore, bidderStore, messageStore) {
        var self = this;

        return self;
    }

    AdminComponent.canActivate = function () {
        return ["$q", "invokeAsync", "customerActions", "bidderActions", "messageActions", function ($q, invokeAsync, customerActions, bidderActions, messageActions) {
            return $q.all([
                invokeAsync(customerActions.getAll),
                invokeAsync(bidderActions.getAll),
                invokeAsync(messageActions.getAllIssues)
            ]);
        }]
    }

    ngX.Component({
        component: AdminComponent,
        route:"/admin",
        providers: ['customerStore', 'bidderStore', 'messageStore'],
        template: [
            "<div class='admin viewComponent'>",
            "</div>"
        ]
    });    
})();