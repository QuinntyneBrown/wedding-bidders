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

        self.baseUri = apiEndpoint.getBaseUrl() + "/profile";

        return self;
    }

    angular.module("app").service("profileService", ["$q", "apiEndpoint", "fetch", profileService]);

})();