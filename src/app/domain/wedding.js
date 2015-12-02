(function () {

    "use strict";

    function wedding($injector, $q, bidActions, bidService, dispatcher, weddingActions, weddingStore) {
        var self = this;
        self.$injector = $injector;
        self.$q = $q;
        self.bidActions = bidActions;
        self.bidService = bidService;
        self.dispatcher = dispatcher;        
        self.weddingActions = weddingActions;
        self.weddingStore = weddingStore;

        self.id = null;
        self.numberOfGuests = null;
        self.numberOfHours = null;
        self.location = null;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                if (self.addActionId === options.id) {
                    self.dispatcher.emit({ actionType: "MODEL_ADDED", options: { id: self.weddingStore.currentWedding.id } });
                }
            }
        });

        self.createInstanceAsync = function (options) {
            var deferred = self.$q.defer();
            var instance = self.createInstance({ data: options.data, includeBids: options.includeBids });
            if (options.includeBids) {
                instance.bidService.getAllByWeddingId({ id: instance.id }).then(function (results) {
                    var bid = instance.$injector.get("bid");
                    var promises = [];
                    for (var i = 0; i < results.length; i++) { promises.push(bid.createInstanceAsync({ data: results[i] })); }                    
                    instance.$q.all(promises).then(function (bidInstances) {
                        instance.bids = bidInstances;
                        deferred.resolve(instance);
                    });                    
                });
            } else {
                deferred.resolve(instance);
            }
            return deferred.promise;
        }

        self.createInstance = function (options) {
            var instance = new wedding(self.$injector, self.$q, self.bidActions, self.bidService, self.dispatcher, self.weddingActions, self.weddingStore);
            if (options.data) {
                instance.id = options.data.id;
                instance.numberOfGuests = options.data.numberOfGuests;
                instance.numberOfHours = options.data.numberOfHours;
                instance.location = options.data.location;
            }
            return instance;
        }
        
        self.add = function () {
            self.addActionId = weddingActions.add({ model: self });
        }

        self.onStoreUpdate = function () {

        }


        self.onDestroy = function () { self.dispatcher.removeListener({ id: self.listenerId }); }

        return self;
    }

    angular.module("app").service("wedding", ["$injector", "$q", "bidActions", "bidService", "dispatcher", "weddingActions", "weddingStore", wedding]);

})();