(function () {

    "use strict";

    function customerStore(dispatcher, guid, CUSTOMER_ACTIONS, store) {
        var self = this;
        self.dispatcher = dispatcher;
        self.store = store;
        self.storeInstance = self.store.createInstance();

        self.dispatcher.addListener({
            actionType: CUSTOMER_ACTIONS.ADD_CUSTOMER,
            callback: function (options) {
                self.storeInstance.addOrUpdate(options.data);
                self.storeInstance.currentCustomer = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        self.currentCustomer = null;

        Object.defineProperty(self, "items", {
            "get": function () { return self.storeInstance.items; }
        });

        return self;
    }

    angular.module("app").service("customerStore", ["dispatcher", "guid", "CUSTOMER_ACTIONS", "store", customerStore])
    .run(["customerStore", function (customerStore) { }]);
})();