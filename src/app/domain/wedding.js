(function () {

    "use strict";

    function wedding(weddingActions, weddingStore) {
        var self = this;
        self.id = null;
        self.numberOfGuests = 0;
        self.weddingActions = weddingActions;
        self.weddingStore = weddingStore;

        self.createInstance = function (options) {
            var instance = new wedding(self.weddingActions, self.weddingStore);
            if (options.data) {
                instance.id = options.data.id;
                instance.numberOfGuests = options.data.numberOfGuests;
            }
            return instance;
        }
        
        self.add = function () {
            weddingActions.add({ model: self });
        }

        self.onStoreUpdate = function () {

        }

        self.listenerId = weddingStore.addListener({ callback: self.onStoreUpdate });

        self.destroy = function () { weddingStore.removeListener({ id: self.listenerId }); }

        return self;
    }

    angular.module("app").service("wedding", ["weddingActions","weddingStore",wedding]);

})();