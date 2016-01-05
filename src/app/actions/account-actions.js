(function () {

    "use strict";

    function accountActions(dispatcher, guid, accountService, ACCOUNT_ACTIONS) {
        var self = this;

        self.getCurrentAccount = function (options) {
            var newGuid = guid();
            accountService.getCurrentAccount().then(function (results) {
                dispatcher.emit({
                    actionType: ACCOUNT_ACTIONS.UPDATE_CURRENT_ACCOUNT, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getBilling = function (options) {
            var newGuid = guid();
            accountService.getBilling().then(function (results) {
                dispatcher.emit({
                    actionType: ACCOUNT_ACTIONS.UPDATE_BILLING, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        return self;
    }

    angular.module("app")
        .service("accountActions", ["dispatcher", "guid", "accountService", "ACCOUNT_ACTIONS", accountActions])


})();