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
            fetch.fromService({ method: "GET", url: self.baseUri + "/getAll" }).then(function (results) {
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

        self.getById = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getById", params: { id: options.id } }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.getAllByCurrentProfile = function () {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getAllByCurrentProfile" }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.baseUri = apiEndpoint.getBaseUrl() + "/wedding";
        return self;
    }

    angular.module("app").service("weddingService", ["$q","apiEndpoint","fetch",weddingService]);

})();