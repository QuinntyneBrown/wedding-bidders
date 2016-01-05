(function () {

    "use strict";

    function conversationActions(dispatcher, guid, conversationService, CONVERSATION_ACTIONS) {

        var self = this;

        self.getAllIssues = function (options) {
            var newGuid = guid();
            conversationService.getAllIssues()
                .then(function (results) {
                    dispatcher.emit({
                        actionType: CONVERSATION_ACTIONS.UPDATE_ALL_ISSUE_CONVERSATIONS, options:
                            { data: results, id: newGuid }
                    });
                });
            return newGuid;
        }

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
        }

        return self;
    }

    angular.module("app")
        .service("conversationActions", ["dispatcher", "guid", "conversationService", "CONVERSATION_ACTIONS", conversationActions])


})();