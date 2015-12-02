(function () {

    "use strict";

    function weddingService($q, apiEndpoint, fetch) {
        var self = this;
        self.add = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "POST", url: self.baseUri + "/add", data: options.data }).then(function(results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;            
        }

        self.getAll = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getAll", data: options.data }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.getAllByCustomerId = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getAllByCustomerId", params: { id: options.id } }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.baseUri = apiEndpoint.getBaseUrl() + "/wedding";
        return self;
    }

    angular.module("app").service("weddingService", ["$q","apiEndpoint","fetch",weddingService]);

})();