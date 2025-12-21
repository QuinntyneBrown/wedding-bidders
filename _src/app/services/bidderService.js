(function () {

    "use strict";

    function bidderService($q, apiEndpoint, fetch) {
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

        self.getTypes = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getTypes" }).then(function (results) {
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

        self.getByProfileId = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getByProfileId", params: { profileId: options.profileId } }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.getByBidId = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getByBidId", params: { bidId: options.bidId } }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.baseUri = apiEndpoint.getBaseUrl() + "/bidder";
        return self;
    }

    angular.module("app").service("bidderService", ["$q", "apiEndpoint", "fetch", bidderService]);

})();