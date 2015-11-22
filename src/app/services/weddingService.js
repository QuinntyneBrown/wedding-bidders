(function () {

    "use strict";

    function weddingService() {
        var self = this;

        return self;
    }

    angular.module("app").service("weddingService", ["fetch",weddingService]);

})();