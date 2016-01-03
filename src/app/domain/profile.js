(function () {

    "use strict";

    function profile($injector, $q, messageActions) {
        var self = this;

        self.$injector = $injector;
        self.$q = $q;
        self.messageActions = messageActions;

        self.createInstance = function (options) {
            var instance = new bidder(self.$injector, self.$q, self.messageActions);
            if (options.data) {
                instance.id = options.data.id;
            }
            return instance;
        }


        return self;
    }

    angular.module("app").service("profile", ["$injector", "$q", "messageActions", profile]);

})();