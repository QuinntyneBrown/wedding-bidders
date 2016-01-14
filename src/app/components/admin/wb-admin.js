(function () {

    "use strict";

    function AdminComponent(conversationStore, customerStore, bidderStore, issueStore, weddingStore) {
        var self = this;
        self.issues = issueStore.items;
        self.conversations = conversationStore.items;
        self.customers = customerStore.items;
        self.bidders = bidderStore.items;
        self.weddings = weddingStore.items;
        return self;
    }

    AdminComponent.canActivate = function () {
        return ["$q", "invokeAsync", "conversationActions", "customerActions", "bidderActions", "issueActions", "weddingActions",
            function ($q, invokeAsync, conversationActions, customerActions, bidderActions, issueActions, weddingActions) {
            return $q.all([
                invokeAsync(conversationActions.getAll),
                invokeAsync(issueActions.getAll),
                invokeAsync(customerActions.getAll),
                invokeAsync(bidderActions.getAll),
                invokeAsync(weddingActions.getAll)
            ]);
        }]
    }

    ngX.Component({
        component: AdminComponent,
        route:"/admin",
        providers: ['conversationStore', 'customerStore', 'bidderStore', 'issueStore', 'weddingStore'],
        template: [
            "<div class='admin viewComponent'>",
            "<admin-slide href='\"/admin/issues\"' title='\"Issues\"' value='vm.issues.length'></admin-slide>",
            "<admin-slide href='\"/admin/conversations\"' title='\"Conversations\"' value='vm.conversations.length'></admin-slide>",
            "<admin-slide href='\"/admin/customers\"' title='\"Customers\"' value='vm.customers.length'></admin-slide>",
            "<admin-slide href='\"/admin/bidders\"' title='\"Bidders\"' value='vm.bidders.length'></admin-slide>",
            "<admin-slide href='\"/admin/weddings\"' title='\"Weddings\"' value='vm.weddings.length'></admin-slide>",
            "</div>"
        ]
    });    
})();