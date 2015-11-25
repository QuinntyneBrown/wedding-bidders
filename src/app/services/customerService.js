(function () {

    "use strict";

    function customerService($q, apiEndpoint, fetch) {
        var self = this;
        self.add = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "POST", url: self.baseUri + "/add", data: options.data }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }
        self.baseUri = apiEndpoint.getBaseUrl() + "/customer";
        return self;
    }

    angular.module("app").service("customerService", ["$q", "apiEndpoint", "fetch", customerService]);

})();