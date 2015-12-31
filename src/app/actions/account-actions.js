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

        self.getCurrentAccountAsync = function () {
            var deferred = self.$q.defer();
            var actionId = self.getCurrentAccount();
            var listenerId = dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (actionId === options.id) {
                        dispatcher.removeListener({ id: listenerId });
                        deferred.resolve();
                    }
                }
            })
            return deferred.promise;
        }

        return self;
    }

    angular.module("app")
        .service("accountActions", ["$q", "dispatcher", "guid", "accountService", "ACCOUNT_ACTIONS", accountActions])


})();