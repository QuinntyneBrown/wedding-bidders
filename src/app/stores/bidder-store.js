(function () {

    "use strict";

    function bidderStore(dispatcher, guid, BIDDER_ACTIONS, store) {
        var self = this;
        self.dispatcher = dispatcher;
        self.store = store;
        self.storeInstance = self.store.createInstance();

        self.dispatcher.addListener({
            actionType: BIDDER_ACTIONS.ADD,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.currentCaterer = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        self.dispatcher.addListener({
            actionType: BIDDER_ACTIONS.UPDATE_ALL,
            callback: function (options) {
                self.storeInstance.items = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        self.dispatcher.addListener({
            actionType: BIDDER_ACTIONS.UPDATE_BY_ID,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        self.currentCaterer = null;

        self.getById = function (id) {
            return self.storeInstance.getById(id);
        }

        Object.defineProperty(self, "items", {
            "get": function () { return self.storeInstance.items; }
        });

        return self;
    }

    angular.module("app").service("bidderStore", ["dispatcher", "guid", "BIDDER_ACTIONS", "store", bidderStore])
    .run(["bidderStore", function (bidderStore) { }]);
})();