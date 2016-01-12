(function () {

    "use strict";

    function ConversationComponent($scope, messageStore, profile, profileStore, safeDigest) {
        var self = this;

        self.messages = [];
        self.other = profileStore.other;
        self.current = profileStore.currentProfile;

        self.storeOnChange = function () {
            self.messages = [];
            for (var i = messageStore.items.length - 1; i > 0; i--) {
                if (self.isInCurrentConversation(messageStore.items[i])) {
                    self.messages.push(messageStore.items[i]);
                }
            }
            safeDigest($scope);
        }

        self.isFromOther = function (message) {
            return message.toProfileId === profileStore.currentProfile.id
                    && message.fromProfileId == profileStore.other.id
        }

        self.isToOther = function (message) {
            return message.fromProfileId === profileStore.currentProfile.id
                    && message.toProfileId == profileStore.other.id
        }

        self.isInCurrentConversation = function (message) {
            return self.isFromOther(message) || self.isToOther(message);
        }

        for (var i = messageStore.items.length - 1; i > 0; i--) {
            if (self.isInCurrentConversation(messageStore.items[i])) {
                self.messages.push(messageStore.items[i]);
            }
        }
        

        return self;
    }

    ConversationComponent.canActivate = function () {
        return ["$q","$route","invokeAsync", "messageActions", "profileActions", function ($q, $route, invokeAsync, messageActions, profileActions) {
            var deferred = $q.defer();

            $q.all([
                invokeAsync({
                    action: profileActions.getOtherProfile,
                    params: { id: Number($route.current.params.otherProfileId) }
                }),
                invokeAsync({
                    action: messageActions.getMessagesByOtherProfileId,
                    params: { id: Number($route.current.params.otherProfileId) }
                })
            ]).then(function () {
                deferred.resolve();
            });

            return deferred.promise;
        }];
    }

    ngX.Component({
        component: ConversationComponent,
        priority: 10,
        route: "/messages/:otherProfileId",
        providers: ["$scope","messageStore", "profile", "profileStore", "safeDigest"],
        template: [
            "<div class='conversation viewComponent'>",
            "   <h1>@{{ ::vm.other.firstname }}</h1>",
            "   <message-form></message-form>",
            '   <div>',
            '       <message-item message="message" data-ng-repeat="message in vm.messages"><message-item>',
            '   </div>',
            "</div>"
        ],
        styles: [
        ]
    });

})();