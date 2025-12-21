(function () {

    "use strict";

    function subscriptionService($q, apiEndpoint, fetch) {
        var self = this;
        self.$q = $q;
        self.charge = function (options) {
            var deferred = self.$q.defer();
            fetch.fromService({ method: "POST", url: self.baseUri + "/charge", data: options.data }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        };

        self.baseUri = apiEndpoint.getBaseUrl() + "/subscription";

        return self;
    }

    angular.module("app").service("subscriptionService", ["$q", "apiEndpoint", "fetch", subscriptionService]);

})();