﻿(function () {

    "use strict";

    function bidService($q, apiEndpoint, fetch) {
        var self = this;
        self.add = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "POST", url: self.baseUri + "/add", data: options.data }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.getAllByWeddingId = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getAllByWeddingId", params: { id: options.id} }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.getAllByCatererId = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getAllByCatererId", params: { id: options.id } }).then(function (results) {
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

        self.baseUri = apiEndpoint.getBaseUrl() + "/bid";

        return self;
    }

    angular.module("app").service("bidService", ["$q", "apiEndpoint", "fetch", bidService]);

})();