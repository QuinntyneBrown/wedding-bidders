(function () {

    "use strict";

    function conversationActions(dispatcher, guid, conversationService, CONVERSATION_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.CONVERSATION_ACTIONS = CONVERSATION_ACTIONS;
        self.conversationService = conversationService;

        self.getAllIssues = function (options) {
            var newGuid = guid();
            self.conversationService.getAllIssues()
                .then(function (results) {
                    self.dispatcher.emit({
                        actionType: self.CONVERSATION_ACTIONS.UPDATE_ALL_ISSUE_CONVERSATIONS, options:
                            { data: results, id: newGuid }
                    });
                });
            return newGuid;
        }

        self.getAllInterProfileConversations = function (options) {
            var newGuid = guid();
            self.conversationService.getAllInterProfileConversations()
                .then(function (results) {
                    self.dispatcher.emit({
                        actionType: self.CONVERSATION_ACTIONS.UPDATE_ALL_INTER_PROFILE_CONVERSATIONS, options:
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