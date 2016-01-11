(function () {

    "use strict";

    function profileService($q, apiEndpoint, fetch) {
        var self = this;
        self.$q = $q;
        self.getCurrentProfile = function (options) {
            var deferred = self.$q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/current" }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        };

        self.getByBidId = function (options) {
            var deferred = self.$q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getByBidId", params: { bidId: options.bidId } }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        };
        
        self.updateIsPersonalizedFlag = function (options) {
            var deferred = self.$q.defer();
            fetch.fromService({ method: "POST", url: self.baseUri + "/updateIsPersonalizedFlag" }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        };

        self.getOtherBidders = function (options) {
            var deferred = self.$q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getOthers" }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        };

        self.baseUri = apiEndpoint.getBaseUrl() + "/profile";

        return self;
    }

    angular.module("app").service("profileService", ["$q", "apiEndpoint", "fetch", profileService]);

})();