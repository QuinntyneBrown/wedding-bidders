(function () {

    "use strict";

    function bidderService($q, apiEndpoint, fetch) {
        var self = this;
        self.addOrUpdate = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "POST", url: self.baseUri + "/addOrUpdate", data: options.data }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.all = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getAll" }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.baseUri = apiEndpoint.getBaseUrl() + "/bidderDescription";
        return self;
    }

    angular.module("app").service("bidderDescriptionService", ["$q", "apiEndpoint", "fetch", bidderService]);

})();