(function () {

    "use strict";

    function wedding($q, bidActions, dispatcher, weddingActions, weddingStore) {
        var self = this;
        self.$q = $q;
        self.bidActions = bidActions;
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
                instance.getAllByWeddingIdActionId = instance.bidActions.getAllByWeddingId({ id: instance.id });

                instance.listenerId = self.dispatcher.addListener({
                    actionType: "CHANGE",
                    callback: function (options) {
                        if (instance.getAllByWeddingIdActionId === options.id) {
                            var promises = [];
                            for (var i = 0; i < options.bids.length; i++) {
                                promises.push(instance.bid.createInstanceAysnc({ data: options.bids[i], includeWedding: false }));
                            }
                            instance.$q.all(promises).then(function (bidInstances) {
                                instance.bids = bidInstances;
                                deferred.resolve(instance);
                            })
                            instance.dispatcher.removeListener({ id: instance.listenerId });
                        }
                        
                    }
                });

            } else {
                deferred.resolve(instance);
            }

            
            return deferred.promise;
        }

        self.createInstance = function (options) {
            var instance = new wedding(self.$q, self.bidActions, self.dispatcher, self.weddingActions, self.weddingStore);
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

    angular.module("app").service("wedding", ["$q","bidActions","dispatcher","weddingActions","weddingStore",wedding]);

})();