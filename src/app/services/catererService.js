(function () {

    "use strict";

    function catererService($q, apiEndpoint, fetch) {
        var self = this;
        self.add = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "POST", url: self.baseUri + "/add", data: options.data }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.getAll = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getAll" }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.baseUri = apiEndpoint.getBaseUrl() + "/caterer";
        return self;
    }

    angular.module("app").service("catererService", ["$q", "apiEndpoint", "fetch", catererService]);

})();