(function () {

    "use strict";

    function messageStore($, dispatcher, MESSAGE_ACTIONS, store) {
        var self = this;
        self.dispatcher = dispatcher;
        self.store = store;
        self.$ = $;
        self.storeInstance = self.store.createInstance();
        self.connection = self.$.hubConnection();
        self.hub = self.connection.createHubProxy("messageHub");
        self.hub.on("onMessageAdded", function (options) {
            self.storeInstance.addOrUpdate({ data: options });
            self.storeInstance.emitChange();
        });
        self.connection.start({ transport: 'longPolling' }, function () {

        });
        
        self.dispatcher.addListener({
            actionType: MESSAGE_ACTIONS.ADD_MESSAGE,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        self.dispatcher.addListener({
            actionType: MESSAGE_ACTIONS.UPDATE_ALL_CURRENT_PROFILE_MESSAGES,
            callback: function (options) {
                self.storeInstance.items = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        Object.defineProperty(self, "items", {
            "get": function () { return self.storeInstance.items; }
        });

        self.getById = function (id) {
            return self.storeInstance.getById(int);
        }

        return self;
    }

    angular.module("app").service("messageStore", ["$","dispatcher", "MESSAGE_ACTIONS", "store", messageStore])
    .run(["messageStore", function (messageStore) {

    }]);
})();