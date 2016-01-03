(function () {

    "use strict";

    function bid($q) {
        var self = this;
        self.$q = $q;

        self.createInstanceAsync = function (options) {
            var deferred = self.$q.defer();
            var instance = new bid(self.$q);
            if (options.data) {
                instance.id = options.data.id;
                instance.weddingId = options.data.weddingId;
                instance.description = options.data.description;
                instance.price = options.data.price;
            }
            deferred.resolve(instance);            
            return deferred.promise;
        }

        self.createInstance = function (options) {
            var instance = new bid(self.$q);
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

    angular.module("app").service("bid", ["$q",bid]);

})();