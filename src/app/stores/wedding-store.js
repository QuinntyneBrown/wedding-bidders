﻿(function () {

    "use strict";

    function weddingStore($, dispatcher, WEDDING_ACTIONS, store) {
        var self = this;
        self.store = store;
        self._storeInstance = null;
        self.dispatcher = dispatcher;
        self.$ = $;
        self.connection = self.$.hubConnection();
        self.hub = self.connection.createHubProxy("weddingHub");
        self.hub.on("onWeddingAdded", function (options) {
            self.storeInstance.addOrUpdate({ data: options.data });
            self.storeInstance.emitChange();
        });
        self.connection.start(function () {

        });

        Object.defineProperty(self, "storeInstance", {
            "get": function () {
                if (!self._storeInstance) {
                    self._storeInstance = self.store.createInstance();
                    return self._storeInstance;
                }
                else {
                    return self._storeInstance;
                }
            }
        });

        self.dispatcher.addListener({
            actionType: WEDDING_ACTIONS.ADD_WEDDING,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.currentWedding = options.data;
                self.storeInstance.emitChange({ id: options.id, data: options.data });
            }
        });

        self.dispatcher.addListener({
            actionType: WEDDING_ACTIONS.UPDATE_ALL_WEDDINGS,
            callback: function (options) {
                self.allWeddings = options.data;
                self.storeInstance.emitChange({ id: options.id, data: options.data });
            }
        });

        self.dispatcher.addListener({
            actionType: WEDDING_ACTIONS.UPDATE_BY_ID,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.storeInstance.emitChange({ id: options.id, data: options.data });
            }
        });

        self.getById = function (id) {
            return self.storeInstance.getById(id);
        }

        self.allWeddings = [];

        self.currentWedding = null;

        return self;
    }

    angular.module("app").service("weddingStore", ["$","dispatcher","WEDDING_ACTIONS", "store", weddingStore])
    .run(["weddingStore", function (weddingStore) { }]);

})();