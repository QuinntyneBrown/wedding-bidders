(function () {

    "use strict";

    function wedding($q, dispatcher, weddingActions, weddingStore) {
        var self = this;
        self.$q = $q;
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

        self.createInstanceAysnc = function (options) {
            var deferred = self.$q.defer();
            deferred.resolve(self.createInstance({ data: options.data }));
            return deferred.promise;
        }

        self.createInstance = function (options) {
            var instance = new wedding(self.$q, self.dispatcher, self.weddingActions, self.weddingStore);
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

    angular.module("app").service("wedding", ["$q","dispatcher","weddingActions","weddingStore",wedding]);

})();