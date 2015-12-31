(function () {

    "use strict";

    function accountService($q, apiEndpoint, fetch) {
        var self = this;
        self.$q = $q;
        self.getCurrentAccount = function (options) {
            var deferred = self.$q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/current" }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        };

        self.baseUri = apiEndpoint.getBaseUrl() + "/account";

        return self;
    }

    angular.module("app").service("accountService", ["$q", "apiEndpoint", "fetch", accountService]);
})();