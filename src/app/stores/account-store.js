(function () {

    "use strict";

    function accountStore(dispatcher, guid, ACCOUNT_ACTIONS, ACCOUNT_STATUS, store, SUBSCRIPTION_ACTIONS) {

        var self = this;
        self.store = store;
        self.storeInstance = self.store.createInstance();
        self.dispatcher = dispatcher;
        self.currentAccount = null;
        self.dispatcher.addListener({
            actionType: ACCOUNT_ACTIONS.UPDATE_CURRENT_ACCOUNT,
            callback: function (options) {
                self.currentAccount = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.dispatcher.addListener({
            actionType: SUBSCRIPTION_ACTIONS.CHARGE_SUCCESS,
            callback: function (options) {
                self.currentAccount.accountStatus = ACCOUNT_STATUS.PAID;
                self.emitChange({ id: options.id });
            }
        });


        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        Object.defineProperty(self, "items", {
            "get": function () { return self.storeInstance.items; }
        });

        return self;
    }

    ngX.Store({ store: accountStore, providers: ["dispatcher", "guid", "ACCOUNT_ACTIONS", "ACCOUNT_STATUS", "store", "SUBSCRIPTION_ACTIONS"] });

})();