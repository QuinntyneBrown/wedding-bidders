(function () {

    "use strict";

    function bidder($injector, $q, messageActions) {
        var self = this;
        self.$injector = $injector;
        self.$q = $q;
        self.messageActions = messageActions;
        self.profile = null;

        self.createInstance = function (options) {
            var instance = new bidder(self.$injector, self.$q, self.messageActions);
            if (options.data) {
                instance.id = options.data.id;
            }

            if (options.profile) {
                var profile = instance.$injector.get("profile");

                instance.profile = profile.createInstance({ data: options.profile })
            }

            return instance;
        }

        return self;
    }

    angular.module("app").service("bidder", ["$injector", "$q", bidder]);

})();