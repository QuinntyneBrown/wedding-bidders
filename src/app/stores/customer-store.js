(function () {

    "use strict";

    function customerStore(dispatcher, CUSTOMER_ACTIONS) {
        var self = this;
        dispatcher.addListener({
            actionType: CUSTOMER_ACTIONS.ADD_CUSTOMER,
            callback: function (options) {
                self.storeInstance.addOrUpdate(options.data);
                self.storeInstance.currentCustomer = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        return self;
    }
    ngX.Store({ store: customerStore, providers: ["dispatcher", "CUSTOMER_ACTIONS"] });

})();