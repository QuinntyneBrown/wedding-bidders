(function () {

    "use strict";

    function subscriptionActions(dispatcher, guid, subscriptionService, SUBSCRIPTION_ACTIONS) {
        var self = this;
        self.dispatcher = dispatcher;
        self.SUBSCRIPTION_ACTIONS = SUBSCRIPTION_ACTIONS;
        self.tryToCharge = function (options) {
            var newGuid = guid();
            subscriptionService.charge({
                data: {
                    token: options.token,
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.SUBSCRIPTION_ACTIONS.CHARGE_SUCCESS, options: {
                        id: newGuid
                    }
                });
            });
            return newGuid;
        };

        self.chargeSuccess = function () {
            self.dispatcher.emit({
                actionType: "CHARGE_SUCCESS"
            });
        }
        return self;
    }

    angular.module("app")
        .service("subscriptionActions", ["dispatcher", "guid", "subscriptionService", "SUBSCRIPTION_ACTIONS", subscriptionActions])


})();