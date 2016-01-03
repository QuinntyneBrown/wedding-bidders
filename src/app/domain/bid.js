(function () {

    "use strict";

    function bid($injector, $q, messageActions) {
        var self = this;
        self.$injector = $injector;
        self.$q = $q;
        self.messageActions = messageActions;

        self.createInstanceAsync = function (options) {
            var deferred = self.$q.defer();
            deferred.resolve(self.createInstance(options));            
            return deferred.promise;
        }

        self.createInstance = function (options) {
            var instance = new bid(self.$injector, self.$q, self.messageActions);
            if (options.data) {
                instance.id = options.data.id;
                instance.weddingId = options.data.weddingId;
                instance.description = options.data.description;
                instance.price = options.data.price;
            }
            return instance;
        }

        return self;
    }

    angular.module("app").service("bid", ["$injector","$q","messageActions",bid]);

})();