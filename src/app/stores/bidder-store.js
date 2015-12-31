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
                self.current = options.data;
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

        self.dispatcher.addListener({
            actionType: BIDDER_ACTIONS.UPDATE_TYPES,
            callback: function (options) {
                self.types = options.data;
                for (var i = 0; i < self.types.length; i++) {
                    self.types[i].displayName = self.types[i].name.replace(/([a-z])([A-Z])/g, '$1 $2');
                }
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        self.current = null;

        self.getById = function (id) {
            return self.storeInstance.getById(id);
        }

        Object.defineProperty(self, "items", {
            "get": function () { return self.storeInstance.items; }
        });

        return self;
    }

    ngX.Store({ store: bidderStore, providers: ["dispatcher", "guid", "BIDDER_ACTIONS", "store"] });

})();