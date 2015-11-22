(function () {

    "use strict";

    function customer() {
        var self = this;

        return self;
    }

    angular.module("app").service("customer", [customer]);

})();