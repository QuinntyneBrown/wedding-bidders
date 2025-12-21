(function () {

    "use strict";

    function conversation($injector) {
        var self = this;
        self.$injector = $injector;

        self.createInstance = function (options) {
            var instance = new conversation(self.$injector);
            if (options.data) {
                instance.id = options.data.id;
            }
            return instance;
        }

        return self;
    }

    angular.module("app").service("conversation", ["$injector",conversation]);

})();