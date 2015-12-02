(function () {
    "use strict";
    function appManager() {
        var self = this;
        self.currentProfile = null;
        return self;
    }
    angular.module("app").service("appManager", [appManager]);
})();