(function () {

    "use strict";

    function messageStore(dispatcher, MESSAGE_ACTIONS, store) {

        var self = this;
        self.dispatcher = dispatcher;
        self._storeInstance = null;

        Object.defineProperty(self, "storeInstance", {
            "get": function () {
                if (!self._storeInstance) {
                    self._storeInstance = self.store.createInstance();
                    return self._storeInstance;
                }
                else {
                    return self._storeInstance;
                }
            }             
        });

        self.dispatcher.addListener({
            actionType: MESSAGE_ACTIONS.ADD,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        self.getById = function (id) {
            return self.storeInstance.getById(int);
        }

        return self;
    }

    angular.module("app").service("messageStore", ["dispatcher", "guid", "MESSAGE_ACTIONS", messageStore])
    .run(["messageStore", function (bidStore) {

    }]);
})();