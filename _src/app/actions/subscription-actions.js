(function () {

    "use strict";

    function subscriptionActions(dispatcher, guid, subscriptionService, SUBSCRIPTION_ACTIONS) {
        var self = this;

        self.tryToCharge = function (options) {
            var newGuid = guid();
            subscriptionService.charge({
                data: {
                    token: options.token
                }
            }).then(function (results) {
                dispatcher.emit({
                    actionType: SUBSCRIPTION_ACTIONS.CHARGE_SUCCESS, options: {
                        id: newGuid
                    }
                });
            });
            return newGuid;
        };

        return self;
    }

    angular.module("app")
        .service("subscriptionActions", ["dispatcher", "guid", "subscriptionService", "SUBSCRIPTION_ACTIONS", subscriptionActions]);


})();