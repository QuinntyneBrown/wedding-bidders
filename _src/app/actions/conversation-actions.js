(function () {

    "use strict";

    function conversationActions(dispatcher, guid, conversationService, CONVERSATION_ACTIONS) {

        var self = this;

        self.getAll = function (options) {
            var newGuid = guid();
            conversationService.getAll()
                .then(function (results) {
                    dispatcher.emit({
                        actionType: CONVERSATION_ACTIONS.ALL, options:
                            { data: results, id: newGuid }
                    });
                });
            return newGuid;
        };

        self.getAllInterProfileConversations = function (options) {
            var newGuid = guid();
            conversationService.getAllInterProfileConversations()
                .then(function (results) {
                    dispatcher.emit({
                        actionType: CONVERSATION_ACTIONS.UPDATE_ALL_INTER_PROFILE_CONVERSATIONS, options:
                            { data: results, id: newGuid }
                    });
                });
            return newGuid;
        };

        self.getAllConversationsByProfileId = function (options) {
            var newGuid = guid();
            conversationService.getAllConversationsByProfileId({ profileId: options.profileId })
                .then(function (results) {
                    dispatcher.emit({
                        actionType: CONVERSATION_ACTIONS.UPDATE_ALL_CONVERSATIONS_BY_PROFILE, options:
                            { data: results, id: newGuid }
                    });
                });
            return newGuid;
        };

        return self;
    }

    angular.module("app")
        .service("conversationActions", ["dispatcher", "guid", "conversationService", "CONVERSATION_ACTIONS", conversationActions]);


})();