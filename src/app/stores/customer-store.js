(function () {

    "use strict";

    function customerStore(dispatcher, guid, CUSTOMER_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: CUSTOMER_ACTIONS.ADD_CUSTOMER,
            callback: function (options) {
                self.addItem(options.data);
                self.currentCustomer = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.customers = [];

        self.currentCustomer = null;

        self.addItem = function (options) { self.customers.push(options.data); }

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        return self;
    }

    angular.module("app").service("customerStore", ["dispatcher", "guid", "CUSTOMER_ACTIONS", customerStore])
    .run(["customerStore", function (customerStore) { }]);
})();