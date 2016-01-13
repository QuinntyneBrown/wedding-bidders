(function () {

    "use strict";

    function AdminComponent(conversationStore, customerStore, bidderStore, messageStore, weddingStore) {
        var self = this;
        self.issues = conversationStore.issues;
        self.conversations = conversationStore.items;
        self.customers = customerStore.items;
        self.bidders = bidderStore.items;
        self.newIssues = messageStore.issues;
        self.weddings = weddingStore.items;
        return self;
    }

    AdminComponent.canActivate = function () {
        return ["$q", "invokeAsync", "conversationActions", "customerActions", "bidderActions", "messageActions", "weddingActions",
            function ($q, invokeAsync, conversationActions, customerActions, bidderActions, messageActions, weddingActions) {
            return $q.all([
                invokeAsync(conversationActions.getAll),
                //invokeAsync(conversationActions.getAllInterProfileConversations),
                invokeAsync(customerActions.getAll),
                invokeAsync(bidderActions.getAll),
                //invokeAsync(messageActions.getAllIssues),
                invokeAsync(weddingActions.getAll)
            ]);
        }]
    }

    ngX.Component({
        component: AdminComponent,
        route:"/admin",
        providers: ['conversationStore', 'customerStore', 'bidderStore', 'messageStore', 'weddingStore'],
        template: [
            "<div class='admin viewComponent'>",
            "<admin-slide href='\"/admin/issues\"' title='\"Issues\"' value='vm.issues.length'></admin-slide>",
            "<admin-slide href='\"/admin/conversations\"' title='\"Conversations\"' value='vm.conversations.length'></admin-slide>",
            "<admin-slide href='\"/admin/customers\"' title='\"Customers\"' value='vm.customers.length'></admin-slide>",
            "<admin-slide href='\"/admin/bidders\"' title='\"Bidders\"' value='vm.bidders.length'></admin-slide>",
            "<admin-slide href='\"/admin/messages\"' title='\"New Issues\"' value='vm.newIssues.length'></admin-slide>",
            "<admin-slide href='\"/admin/weddings\"' title='\"Weddings\"' value='vm.weddings.length'></admin-slide>",
            "</div>"
        ]
    });    
})();