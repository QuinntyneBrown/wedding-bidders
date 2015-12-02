(function () {

    "use strict";

    function securityStore(dispatcher, guid, localStorageManager, SECURITY_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.localStorageManager = localStorageManager;

        self.dispatcher.addListener({
            actionType: SECURITY_ACTIONS.LOGIN,
            callback: function (options) {                
                self.token = options.token;
                self.emitChange({ id: options.id });
            }
        });


        Object.defineProperty(self, "token", {
            get: function () { return self.localStorageManager.get({ name: "token" }); },
            set: function (value) { self.localStorageManager.put({ name: "token", value: value }); }
        })


        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        return self;
    }

    angular.module("app")
        .service("securityStore", ["dispatcher", "guid", "localStorageManager", "SECURITY_ACTIONS", securityStore])
        .run(["securityStore", function (securityStore) { }]);
})();