(function () {

    "use strict";

    function accountActions($q, dispatcher, guid, accountService, ACCOUNT_ACTIONS) {

        var self = this;
        self.$q = $q;
        self.dispatcher = dispatcher;
        self.ACCOUNT_ACTIONS = ACCOUNT_ACTIONS;

        self.getCurrentAccount = function (options) {
            var newGuid = guid();
            accountService.getCurrentAccount().then(function (results) {
                self.dispatcher.emit({
                    actionType: self.ACCOUNT_ACTIONS.UPDATE_CURRENT_ACCOUNT, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getBilling = function (options) {
            var newGuid = guid();
            accountService.getBilling().then(function (results) {
                self.dispatcher.emit({
                    actionType: self.ACCOUNT_ACTIONS.UPDATE_BILLING, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        return self;
    }

    angular.module("app")
        .service("accountActions", ["$q", "dispatcher", "guid", "accountService", "ACCOUNT_ACTIONS", accountActions])


})();