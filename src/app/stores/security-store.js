(function () {

    "use strict";

    function securityStore(dispatcher, guid, SECURITY_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: SECURITY_ACTIONS.LOGIN,
            callback: function (options) {                
                self.token = options.token;
                self.emitChange({ id: options.id });
            }
        });

        self.token = null;

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        return self;
    }

    angular.module("app")
        .service("securityStore", ["dispatcher", "guid", "SECURITY_ACTIONS", securityStore])
        .run(["securityStore", function (securityStore) { }]);
})();