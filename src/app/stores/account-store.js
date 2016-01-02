(function () {

    "use strict";

    function accountStore(dispatcher, ACCOUNT_ACTIONS, ACCOUNT_STATUS, SUBSCRIPTION_ACTIONS) {
        var self = this;

        dispatcher.addListener({
            actionType: ACCOUNT_ACTIONS.UPDATE_CURRENT_ACCOUNT,
            callback: function (options) {
                self.currentAccount = options.data;
                self.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: SUBSCRIPTION_ACTIONS.CHARGE_SUCCESS,
            callback: function (options) {
                self.billing = options.data;
                self.emitChange({ id: options.id });
            }
        });

        return self;
    }

    ngX.Store({ store: accountStore, providers: ["dispatcher", "ACCOUNT_ACTIONS", "ACCOUNT_STATUS", "SUBSCRIPTION_ACTIONS"] });

})();