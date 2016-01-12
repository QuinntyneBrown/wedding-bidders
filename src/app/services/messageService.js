(function () {

    "use strict";

    function messageService($q, apiEndpoint, fetch) {
        var self = this;
        self.add = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "POST", url: self.baseUri + "/add", data: options.data }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.getAllForCurrentProfile = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getAllForCurrentProfile" }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.getAllIssues = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/allIssues" }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.getByOtherProfileId = function (options) {
            var deferred = $q.defer();
            fetch.fromService({
                method: "GET", url: self.baseUri + "/getByOtherProfileId", params:
                    {
                        otherProfileId: options.otherProfileId
                    }
            }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        };

        self.baseUri = apiEndpoint.getBaseUrl() + "/message";
        return self;
    }

    angular.module("app").service("messageService", ["$q", "apiEndpoint", "fetch", messageService]);

})();