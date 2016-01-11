(function () {

    "use strict";

    function ConversationComponent(messageStore, profile, profileStore) {
        var self = this;
        return self;
    }

    ngX.Component({
        component: ConversationComponent,
        priority: 10,
        route: "/messages/:otherProfileId",
        providers: ["messageStore", "profile", "profileStore"],
        template: [
            "<div class='conversation viewComponent'>",
            "   <h1>Conversation</h1>",
            "   <a href='#/messages'>Contact List</a>",
            "</div>"
        ],
        styles: [
        ]
    });

})();