(function () {

    "use strict";

    function securityStore(dispatcher, localStorageManager, SECURITY_ACTIONS, store) {
        var self = this;
        self.dispatcher = dispatcher;
        self.localStorageManager = localStorageManager;
        self.store = store;
        self.storeInstance = self.store.createInstance();
        self.dispatcher.addListener({
            actionType: SECURITY_ACTIONS.LOGIN,
            callback: function (options) {                
                self.token = options.token;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        self.dispatcher.addListener({
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