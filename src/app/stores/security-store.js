(function () {

    "use strict";

    function securityStore(dispatcher, localStorageManager, SECURITY_ACTIONS) {
        var self = this;
        self.localStorageManager = localStorageManager;

        dispatcher.addListener({
            actionType: SECURITY_ACTIONS.LOGIN,
            callback: function (options) {                
                self.token = options.token;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: SECURITY_ACTIONS.LOGIN_FAIL,
            callback: function (options) {
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        Object.defineProperty(self, "token", {
            get: function () { return self.localStorageManager.get({ name: "token" }); },
            set: function (value) { self.localStorageManager.put({ name: "token", value: value }); }
        });

        return self;
    }

    ngX.Store({ store: securityStore, providers: ["dispatcher", "localStorageManager", "SECURITY_ACTIONS", "store"] });

})();