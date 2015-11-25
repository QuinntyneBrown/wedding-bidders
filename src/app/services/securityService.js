(function () {

    "use strict";

    function securityService($q, apiEndpoint, fetch, formEncode) {
        var self = this;

        self.tryToLogin = function (options) {
            var newGuid = guid();
            angular.extend(options.data, { grant_type: "password" });
            var formEncodedData = formEncode(options.data);
            var headers = { "Content-Type": "application/x-www-form-urlencoded" };

            fetch.fromService({ method: "POST", url: self.baseUri + "/token", data: formEncodedData, headers: headers }).then(function (results) {
                self.dispatcher.emit({ actionType: self.SECURITY_ACTIONS.LOGIN, token: results.data.token });
            });
            return newGuid;
        };

        self.baseUri = apiEndpoint.getBaseUrl() + "/security";

        return self;
    }

    angular.module("app").service("securityService", ["$q", "apiEndpoint", "fetch", "formEncode", securityService]);

})();