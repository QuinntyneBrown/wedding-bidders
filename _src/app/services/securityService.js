(function () {

    "use strict";

    function securityService($q, apiEndpoint, fetch, formEncode) {
        var self = this;
        self.$q = $q;
        self.tryToLogin = function (options) {
            var deferred = self.$q.defer();
            angular.extend(options.data, { grant_type: "password" });
            var formEncodedData = formEncode(options.data);
            var headers = { "Content-Type": "application/x-www-form-urlencoded" };
            fetch.fromService({ method: "POST", url: self.baseUri + "/token", data: formEncodedData, headers: headers }).then(function (results) {
                deferred.resolve(results.data);
            }).catch(function (error) {
                deferred.resolve(error);
            });
            return deferred.promise;            
        };

        self.baseUri = apiEndpoint.getBaseUrl() + "/security";

        return self;
    }

    angular.module("app").service("securityService", ["$q", "apiEndpoint", "fetch", "formEncode",securityService]);

})();