(function () {

    "use strict";

    function conversationService($q, apiEndpoint, fetch) {
        var self = this;

        self.getAllIssues = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/allIssues" }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.getAllInterProfileConversations = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/allInterProfileConversations" }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.baseUri = apiEndpoint.getBaseUrl() + "/conversation";
        return self;
    }

    angular.module("app").service("conversationService", ["$q", "apiEndpoint", "fetch", conversationService]);

})();