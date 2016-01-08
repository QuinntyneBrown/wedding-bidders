(function () {

    "use strict";

    function conversationStore(dispatcher, CONVERSATION_ACTIONS) {
        var self = this;

        dispatcher.addListener({
            actionType: CONVERSATION_ACTIONS.UPDATE_ALL_ISSUE_CONVERSATIONS,
            callback: function (options) {
                self.issues = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: CONVERSATION_ACTIONS.UPDATE_ALL_INTER_PROFILE_CONVERSATIONS,
            callback: function (options) {
                self.interProfileConversations = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: CONVERSATION_ACTIONS.UPDATE_ALL_CONVERSATIONS_BY_PROFILE,
            callback: function (options) {
                self.storeInstance.items = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        return self;
    }

    ngX.Store({ store: conversationStore, providers: ["dispatcher", "CONVERSATION_ACTIONS"] });

})();