(function () {

    "use strict";

    function ConversationComponent(messageStore, profile, profileStore) {
        var self = this;

        self.messages = [];

        self.storeOnChange = function () {
            self.messages = [];
            for (var i = 0; i < messageStore.items.length; i++) {
                if (self.isInCurrentConversation(messageStore.items[i])) {
                    self.messages.push(messageStore.items[i]);
                }
            }
            safeDigest($scope);
        }

        self.isFromOther = function (message) {
            return message.toId === profileStore.current.id
                    && message.fromId == profileStore.other.id
        }

        self.isToOther = function (message) {
            return message.fromId === profileStore.current.id
                    && message.toId == profileStore.other.id
        }

        self.isInCurrentConversation = function (message) {
            return self.isFromOther(message) || self.isToOther(message);
        }

        for (var i = 0; i < messageStore.items.length; i++) {
            if (self.isInCurrentConversation(messageStore.items[i])) {
                self.messages.push(messageStore.items[i]);
            }
        }

        return self;
    }

    ConversationComponent.canActivate = function () {
        return ["$route","invokeAsync", "profileActions", function ($route,invokeAsync, profileActions) {
            return invokeAsync({
                action: profileActions.getOtherProfile,
                params: { id: Number($route.current.params.otherProfileId)}
            });
        }];
    }

    ngX.Component({
        component: ConversationComponent,
        priority: 10,
        route: "/messages/:otherProfileId",
        providers: ["messageStore", "profile", "profileStore"],
        template: [
            "<div class='conversation viewComponent'>",
            "   <message-form></message-form>",
            "   <div>",
            "   </div>",
            "</div>"
        ],
        styles: [
        ]
    });

})();