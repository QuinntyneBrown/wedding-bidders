(function () {

    "use strict";

    function AdminConversationsComponent(conversationStore) {
        var self = this;
        return self;
    }

    AdminConversationsComponent.canActivate = function () {
        return ["$q", "invokeAsync", "bidderActions", function ($q, invokeAsync, conversationActions) {
            return $q.all([
                invokeAsync(conversationActions.getAll)
            ]);
        }]
    }

    ngX.Component({
        component: AdminConversationsComponent,
        route: "/admin/conversations",
        providers: ['conversationStore'],
        template: [
            "<div class='adminBidders viewComponent'>",
            "</div>"
        ]
    });
})();