(function () {

    "use strict";

    function AdminIssuesComponent(conversationStore) {
        var self = this;
        return self;
    }

    AdminIssuesComponent.canActivate = function () {
        return ["$q", "invokeAsync", "conversationActions", function ($q, invokeAsync, converationActions) {
            return $q.all([
                invokeAsync(conversationActions.getAllIssues)
            ]);
        }]
    }

    ngX.Component({
        component: AdminIssuesComponent,
        route: "/admin/issues",
        providers: ['converationStore'],
        template: [
            "<div class='adminIssues viewComponent'>",
            "</div>"
        ]
    });
})();