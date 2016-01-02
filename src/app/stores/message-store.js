(function () {

    "use strict";

    function messageStore($, dispatcher, MESSAGE_ACTIONS) {
        var self = this;
        self.connection = $.hubConnection();
        self.hub = self.connection.createHubProxy("messageHub");

        self.hub.on("onMessageAdded", function (options) {
            self.storeInstance.addOrUpdate({ data: options });
            self.storeInstance.emitChange();
        });
        
        dispatcher.addListener({
            actionType: MESSAGE_ACTIONS.ADD_MESSAGE,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: MESSAGE_ACTIONS.UPDATE_ALL_CURRENT_PROFILE_MESSAGES,
            callback: function (options) {
                self.storeInstance.items = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        return self;
    }

    ngX.Store({ store: messageStore, providers: ["$", "dispatcher", "MESSAGE_ACTIONS"] });

})();