﻿(function () {

    "use strict";

    function wedding(dispatcher, weddingActions, weddingStore) {
        var self = this;
        self.id = null;
        self.dispatcher = dispatcher;
        self.numberOfGuests = 0;
        self.weddingActions = weddingActions;
        self.weddingStore = weddingStore;

        self.listenerId = self.dispatcher.addListener(function (options) {
            switch (options.actionType) {
                case "CHANGE":
                    break;
            }
        });

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


        self.onDestroy = function () { self.dispatcher.removeListener({ id: self.listenerId }); }

        return self;
    }

    angular.module("app").service("wedding", ["dispatcher","weddingActions","weddingStore",wedding]);

})();