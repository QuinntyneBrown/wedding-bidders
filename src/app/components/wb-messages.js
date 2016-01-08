(function () {

    "use strict";

    function MessagesComponent(conversationCollection, conversationStore) {
        var self = this;


        return self;
    }

    MessagesComponent.canActivate = function () {
        return ["invokeAsync", "conversationActions", "profileStore", function (invokeAsync, conversationActions, profileStore) {
            return invokeAsync({
                    action: conversationActions.getAllConversationsByProfileId,
                    params: { profileId: profileStore.currentProfile.id }
                });
        }];
    }

    ngX.Component({
        component: MessagesComponent,
        priority: 10,
        routes: ["/messages","/messages/:profileId"],
        providers: ["conversationCollection", "conversationStore"],
        template: [
            "<div class='messages'>",
            "</div>"
        ]
    });

})();