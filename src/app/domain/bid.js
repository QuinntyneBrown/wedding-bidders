(function () {

    "use strict";

    function bid($injector, $q, bidActions, invokeAsync, messageActions, numeral) {
        var self = this;
        self.$injector = $injector;
        self.$q = $q;
        self.messageActions = messageActions;
        self.numeral = numeral;

        self.createInstanceAsync = function (options) {
            var deferred = self.$q.defer();
            deferred.resolve(self.createInstance(options));            
            return deferred.promise;
        }

        self.createInstance = function (options) {
            var instance = new bid(self.$injector, self.$q, self.messageActions, self.numeral);
            if (options.data) {
                instance.id = options.data.id;
                instance.weddingId = options.data.weddingId;
                instance.description = options.data.description;
                instance.price = self.numeral(options.data.price).format('$0,0.00');;
                instance.bidderId = options.data.bidderId;
            }

            if (options.bidders) {
                var bidder = self.$injector.get("bidder");
                for (var i = 0; i < options.bidders.length; i++) {
                    if (options.bidders[i].id === instance.bidderId)
                        instance.bidder = bidder.createInstance({ data: options.bidders[i], profiles: options.profiles });
                }                
            }

            return instance;
        }

        self.addAsync = function (options) {
            return invokeAsync({
                action: bidActions.add,
                params: {
                    weddingId: options.weddingId,
                    price: options.price,
                    description: options.description
                }
            });
        }
        return self;
    }

    angular.module("app").service("bid", ["$injector", "$q", "bidActions", "invokeAsync", "messageActions", "numeral", bid]);

})();